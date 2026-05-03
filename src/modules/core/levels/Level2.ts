import { CollectionLayout, CollectionSchema, Timeline } from '../../engine';
import { levelSchema } from '../../layouts/LevelLayout';
import { Level, LevelProps } from './levels';
import { createLevelLayout } from '../helpers/CreateLevelLayout';
import { syncSafeZoneTweenCollider } from '../helpers/SyncSafeZoneCollider';

const schema = {
	...levelSchema,
} satisfies CollectionSchema;

type Layout = CollectionLayout<typeof schema>;

export class Level2 implements Level {
	public readonly layout: Layout;

	private readonly timeline: Timeline;

	constructor(props: LevelProps) {
		const { level_factory, levelNumber } = props;

		this.timeline = new Timeline();

		this.layout = createLevelLayout(level_factory, levelNumber, schema);
		this.animate();
	}

	private animate() {
		const { safe_zones } = this.layout;

		this.timeline
			.tween(safe_zones[1], 'scale', { x: 0.01 }, 0.5)
			.yoyo()
			.repeat(Infinity, 0.5)
			.onUpdate(syncSafeZoneTweenCollider);

		const offset = 200;

		this.timeline
			.tween(safe_zones[2], 'scale', { x: safe_zones[2].scale.x - offset }, 1)
			.yoyo(1)
			.repeat(Infinity, 1)
			.onUpdate(syncSafeZoneTweenCollider);

		this.timeline
			.tween(
				safe_zones[2],
				'position',
				{ x: safe_zones[2].position.x - offset / 2 },
				1,
			)
			.yoyo(1)
			.repeat(Infinity, 1)
			.onUpdate(syncSafeZoneTweenCollider);

		this.timeline
			.tween(safe_zones[3], 'scale', { x: safe_zones[3].scale.x + offset }, 1)
			.yoyo(1)
			.repeat(Infinity, 1)
			.onUpdate(syncSafeZoneTweenCollider);

		this.timeline
			.tween(
				safe_zones[3],
				'position',
				{ x: safe_zones[3].position.x - offset / 2 },
				1,
			)
			.yoyo(1)
			.repeat(Infinity, 1)
			.onUpdate(syncSafeZoneTweenCollider);

		this.timeline
			.tween(safe_zones[6], 'scale', { x: 0.01 }, 0.5)
			.yoyo()
			.repeat(Infinity, 1)
			.onUpdate(syncSafeZoneTweenCollider);

		this.timeline
			.tween(safe_zones[7], 'scale', { x: 0.01 }, 0.5)
			.delay(0.5)
			.yoyo()
			.repeat(Infinity, 1)
			.onUpdate(syncSafeZoneTweenCollider);

		this.timeline
			.tween(safe_zones[8], 'scale', { x: 0.01 }, 0.5)
			.delay(1)
			.yoyo()
			.repeat(Infinity, 1)
			.onUpdate(syncSafeZoneTweenCollider);
	}

	destroy(): void {
		this.timeline.destroy();
	}
}
