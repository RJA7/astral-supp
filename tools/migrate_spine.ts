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
	if (data.skeleton) data.skeleton.spine = "4.2";

	if (data.animations) {
		for (const anim of Object.values<any>(data.animations)) {
			// 1. Bone Rotation Rename
			if (anim.bones) {
				for (const bone of Object.values<any>(anim.bones)) {
					bone.rotate?.forEach((f: any) => {
						if (f.angle !== undefined) { f.value = f.angle; delete f.angle; }
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

					let hasRGBAnimation = false;
					let hasAlphaAnimation = false;

					frames.forEach((frame, i) => {
						const hex = frame.color || "ffffffff";
						const rgb = hex.substring(0, 6).toLowerCase();
						const alpha = parseInt(hex.substring(6, 8), 16) / 255;

						// Check if RGB is something other than white "ffffff"
						// or if it changes across frames
						if (rgb !== "ffffff" || (i > 0 && rgb !== rgbTimeline[i-1]?.color)) {
							hasRGBAnimation = true;
						}

						// Check if Alpha is something other than 1.0
						// or if it changes across frames
						if (alpha !== 1 || (i > 0 && alpha !== alphaTimeline[i-1]?.value)) {
							hasAlphaAnimation = true;
						}

						rgbTimeline.push({ time: frame.time ?? 0, color: rgb, curve: frame.curve });
						alphaTimeline.push({ time: frame.time ?? 0, value: parseFloat(alpha.toFixed(3)), curve: frame.curve });
					});

					// Logic: Map only what is actually changing
					if (hasAlphaAnimation) slot.alpha = alphaTimeline;
					if (hasRGBAnimation) slot.rgb = rgbTimeline;

					delete slot.color;
				}
			}
		}
	}
	return data;
}

// Main execution
const files = globSync(PATTERN);
files.forEach(file => {
	const json = JSON.parse(fs.readFileSync(file, 'utf8'));
	if (json.skeleton?.spine?.startsWith("3.")) {
		const migrated = migrateData(json);
		const newPath = file.replace(/\.json$/, '.spinejson');
		fs.writeFileSync(newPath, JSON.stringify(migrated, null, 2));
		fs.unlinkSync(file);
		console.log(`Migrated: ${path.basename(file)}`);
	}
});
