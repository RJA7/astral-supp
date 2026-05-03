import { levelSchema } from '../../layouts/LevelLayout';
import { CollectionLayout, CollectionSchema } from '../../engine/layout/types';
import { Level, LevelProps } from './levels';
import { createLevelLayout } from '../helpers/CreateLevelLayout';
import { Factory } from '../../engine/components/Factory';
import { Property } from '../../engine/types/Property';
import { bulletSchema } from '../../layouts/BulletLayout';
import { DEG_TO_RAD } from '../../engine/utils/Math';
import { Timeline } from '../../engine/timeline/Timeline';

const schema = {
	...levelSchema,
	shooter: {},
	bullets: {
		factory: Factory,
	},
} satisfies CollectionSchema;

type Layout = CollectionLayout<typeof schema>;

export class Level3 implements Level {
	public readonly layout: Layout;

	private readonly timeline: Timeline;

	constructor(props: LevelProps) {
		const { level_factory, levelNumber } = props;

		this.layout = createLevelLayout(level_factory, levelNumber, schema);

		this.timeline = new Timeline();

		this.setupShooter();
	}

	private setupShooter() {
		const { shooter, bullets } = this.layout;

		this.timeline
			.tween(shooter, 'euler', { z: 160 }, 3)
			.yoyo()
			.repeat(Infinity);

		this.timeline.loop(0.8, () => {
			const bullet = bullets.factory.create(bulletSchema);
			const rotation = shooter.angle * DEG_TO_RAD;
			const direction = vmath.vector3(
				Math.cos(rotation),
				Math.sin(rotation),
				0,
			);
			const distance = 2000;
			const target = bullet.getPosition().add(direction.mul(distance));

			bullet.animate(
				Property.Position,
				target,
				10,
				undefined,
				undefined,
				undefined,
				() => {
					bullet.delete();
				},
			);
		});
	}

	public destroy() {
		this.timeline.destroy();
	}
}
