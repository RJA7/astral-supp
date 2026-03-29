import { globSync } from 'glob';
import fs from 'node:fs';
import path from 'node:path';

const SOURCE_DIR = path.resolve('../app/assets/spines');
const PATTERN = `${SOURCE_DIR}/**/*.json`;

interface SpineFrame {
	time?: number;
	color?: string;
	curve?: any;
}

function migrateData(data: any) {
	if (data.skeleton) {
		data.skeleton.spine = '4.2';
	}

	if (data.animations) {
		for (const anim of Object.values<any>(data.animations)) {
			// 1. Bone Rotation Rename
			if (anim.bones) {
				for (const bone of Object.values<any>(anim.bones)) {
					bone.rotate?.forEach((f: any) => {
						if (f.angle !== undefined) {
							f.value = f.angle;
							delete f.angle;
						}
					});
				}
			}

			// 2. Optimized Slot Split (RGB vs Alpha)
			if (anim.slots) {
				for (const [slotName, slot] of Object.entries<any>(anim.slots)) {
					if (!slot.color) continue;

					const frames: SpineFrame[] = slot.color;
					const rgbTimeline: any[] = [];
					const alphaTimeline: any[] = [];

					// FIX #1: Correctly detect animation by checking whether values
					// actually change across frames, using strict cross-frame comparison
					// rather than the broken || logic that flagged any non-default value
					// as animated regardless of whether it ever changed.
					let hasRGBAnimation = false;
					let hasAlphaAnimation = false;

					const parsedFrames = frames.map((frame) => {
						const hex = frame.color || 'ffffffff';
						const rgb = hex.substring(0, 6).toLowerCase();
						const alpha = parseFloat(
							(parseInt(hex.substring(6, 8), 16) / 255).toFixed(3),
						);
						return { frame, rgb, alpha };
					});

					for (let i = 1; i < parsedFrames.length; i++) {
						if (parsedFrames[i].rgb !== parsedFrames[0].rgb) {
							hasRGBAnimation = true;
						}
						if (parsedFrames[i].alpha !== parsedFrames[0].alpha) {
							hasAlphaAnimation = true;
						}
					}

					parsedFrames.forEach(({ frame, rgb, alpha }) => {
						// FIX #4: Omit curve key entirely when undefined instead of
						// spreading undefined values into intermediate objects.
						const rgbEntry: any = { time: frame.time ?? 0, color: rgb };
						if (frame.curve !== undefined) rgbEntry.curve = frame.curve;
						rgbTimeline.push(rgbEntry);

						const alphaEntry: any = { time: frame.time ?? 0, value: alpha };
						if (frame.curve !== undefined) alphaEntry.curve = frame.curve;
						alphaTimeline.push(alphaEntry);
					});

					if (hasAlphaAnimation) slot.alpha = alphaTimeline;
					if (hasRGBAnimation) slot.rgb = rgbTimeline;

					delete slot.color;
				}
			}

			// FIX #3: Run migrateAllTimelines only on the parts of the animation
			// that were NOT already processed by the slot migration above, to
			// prevent migrateCurve from running a second pass over rgb/alpha frames
			// and corrupting already-correct curve data.
			const { slots: _slots, ...animWithoutSlots } = anim;
			migrateAllTimelines(animWithoutSlots);
		}
	}
	return data;
}

function migrateCurve(frame: any) {
	if (frame.curve === 'stepped') return;

	if (typeof frame.curve === 'number') {
		// FIX #2: Validate that c2/c3/c4 exist before constructing the curve
		// array. Previously, missing control points produced malformed arrays
		// like [number, undefined, undefined, undefined].
		if (
			frame.c2 === undefined ||
			frame.c3 === undefined ||
			frame.c4 === undefined
		) {
			throw new Error(
				`Bezier curve frame is missing control points: c2=${frame.c2}, c3=${frame.c3}, c4=${frame.c4}. ` +
					`Frame data: ${JSON.stringify(frame)}`,
			);
		}
		frame.curve = [frame.curve, frame.c2, frame.c3, frame.c4];
		delete frame.c2;
		delete frame.c3;
		delete frame.c4;
	}

	if (frame.curve === undefined) {
		delete frame.curve;
	}
}

function migrateAllTimelines(obj: any) {
	for (const value of Object.values(obj)) {
		if (Array.isArray(value)) {
			value.forEach((f: any) => migrateCurve(f));
		} else if (typeof value === 'object' && value !== null) {
			migrateAllTimelines(value);
		}
	}
}

// Main execution
const files = globSync(PATTERN);
files.forEach((file) => {
	const json = JSON.parse(fs.readFileSync(file, 'utf8'));
	if (json.skeleton?.spine?.startsWith('3.')) {
		const migrated = migrateData(json);
		const newPath = file.replace(/\.json$/, '.spinejson');

		// FIX #5: Make the write+delete operation as safe as possible by
		// verifying the write succeeded before deleting the source, and
		// never deleting the original if anything throws.
		try {
			fs.writeFileSync(newPath, JSON.stringify(migrated, null, 2));

			// Verify the output file exists and is non-empty before deleting source
			const written = fs.statSync(newPath);
			if (written.size === 0) {
				throw new Error(`Written file is empty: ${newPath}`);
			}

			fs.unlinkSync(file);
			console.log(`Migrated: ${path.basename(file)}`);
		} catch (err) {
			// Clean up the partially-written output so it doesn't linger as corrupt
			if (fs.existsSync(newPath)) {
				fs.unlinkSync(newPath);
			}
			console.error(`Failed to migrate ${path.basename(file)}:`, err);
			// Re-throw so the process exits non-zero and CI catches it
			throw err;
		}
	}
});
