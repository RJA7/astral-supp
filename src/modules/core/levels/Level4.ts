import { CollectionLayout, CollectionSchema, Timeline } from '../../engine';
import { levelSchema } from '../../layouts/LevelLayout';
import { Level, LevelProps } from './levels';
import { createLevelLayout } from '../helpers/CreateLevelLayout';
import {
	syncSafeZoneCollider,
	syncSafeZoneTweenCollider,
} from '../helpers/SyncSafeZoneCollider';

const schema = {
	...levelSchema,
} satisfies CollectionSchema;

type Layout = CollectionLayout<typeof schema>;

export class Level4 implements Level {
	public readonly layout: Layout;

	private readonly timeline: Timeline;

	constructor(props: LevelProps) {
		const { level_factory, levelNumber } = props;

		this.layout = createLevelLayout(level_factory, levelNumber, schema);

		this.timeline = new Timeline();
	}

	public async start() {
		const { safe_zones } = this.layout;

		await this.timeline.wait(0.5);

		const statics = [0, 7, 8, 15, 16];

		safe_zones.forEach((safeZone, i) => {
			if (statics.includes(i)) return;

			safeZone.setScale2D(vmath.vector3());
			syncSafeZoneCollider(safeZone);
		});

		const items = [
			// START
			{ n: [1], s: 1 },

			// open forward
			{ n: [2, 3], s: 1 },

			// remove old
			{ n: [1], s: 0 },

			// move deeper
			{ n: [4], s: 1 },

			// TRICK:
			// player should return from 4 back to 3
			// because 5 will not connect safely

			{ n: [2], s: 0 },

			// safe island remains on 3 + 4
			{ n: [5, 6], s: 1 },

			// punish staying on 4
			{ n: [4], s: 0 },

			// only safe route is now 3 -> 5

			{ n: [7], s: 1 },

			// again push forward
			{ n: [3], s: 0 },

			// player should now stabilize on 5 or 6
			{ n: [8, 9], s: 1 },

			// fake forward greed
			{ n: [10], s: 1 },

			// trap closes behind aggressive players
			{ n: [7], s: 0 },

			// safe island still exists on 5/6/8/9
			{ n: [11], s: 1 },

			// force backward correction
			{ n: [8], s: 0 },

			// correct move:
			// 9 -> 6 -> 11

			{ n: [12, 13], s: 1 },

			// remove unstable branch
			{ n: [10], s: 0 },

			// safe chain remains
			{ n: [6], s: 0 },

			// must commit forward again
			{ n: [14], s: 1 },

			// backward-safe island
			{ n: [11], s: 0 },

			// correct route:
			// 13 -> 12 -> 14

			{ n: [15, 16], s: 1 },

			// punish rushing to 14 center
			{ n: [14], s: 0 },

			// only side islands survive
			{ n: [17], s: 1 },

			// recovery step
			{ n: [12], s: 0 },

			// safe structure:
			// 15/16 -> 17

			{ n: [18, 19], s: 1 },

			// deceptive collapse
			{ n: [15], s: 0 },

			// must briefly step back to 16
			// before advancing

			{ n: [20], s: 1 },

			// remove unstable side
			{ n: [17], s: 0 },

			// correct:
			// 16 -> 18 -> 20

			{ n: [21], s: 1 },

			// final squeeze
			{ n: [18], s: 0 },

			// winning island:
			// 19 -> 21
		];

		while (true) {
			for (const item of items) {
				const scale = item.s * 60;

				item.n.forEach((index) => {
					this.timeline.tweens
						.add(safe_zones[index], 'scale', { x: scale, y: scale }, 0.5)
						.onUpdate(syncSafeZoneTweenCollider);
				});

				await this.timeline.wait(1);
			}
		}
	}

	public destroy() {
		this.timeline.destroy();
	}
}
