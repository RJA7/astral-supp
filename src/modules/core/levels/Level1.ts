import {
	CollectionLayout,
	CollectionSchema,
	DEG_TO_RAD,
	Factory,
	Property,
	Timeline,
} from '../../engine';
import { levelSchema } from '../../layouts/LevelLayout';
import { bulletSchema } from '../../layouts/BulletLayout';
import { Level, LevelProps } from './levels';
import { createLevelLayout } from '../helpers/CreateLevelLayout';
import { PhysicsGroup } from '../../enums/PhysicsGroup';

const schema = {
	...levelSchema,
	shooter: {},
	bullets: {
		factory: Factory,
	},
	slow_down_trigger: {},
} satisfies CollectionSchema;

export type Layout = CollectionLayout<typeof schema>;

export class Level1 implements Level {
	public readonly layout: Layout;

	private readonly timeline: Timeline;

	constructor(props: LevelProps) {
		const { level_factory, levelNumber } = props;

		this.layout = createLevelLayout(level_factory, levelNumber, schema);

		this.timeline = new Timeline();

		this.setupShooter();
		this.setupBullets();

		this.layout.slow_down_trigger.physics.setHandler(
			PhysicsGroup.player,
			() => {
				this.layout.slow_down_trigger.delete();
				this.timeline.timeScale = 0.5;
			},
		);
	}

	private setupShooter() {
		const { shooter } = this.layout;
		this.timeline.tween(shooter, 'euler', { z: -360 }, 6).repeat(Infinity);
	}

	public destroy() {
		this.timeline.destroy();
	}

	private setupBullets() {
		const { shooter, bullets } = this.layout;

		this.timeline.loop(0.5, () => {
			[0, 120, 240].forEach((angle, i) => {
				const bullet = bullets.factory.create(bulletSchema);
				const rotation = (shooter.angle + angle) * DEG_TO_RAD;
				const direction = vmath.vector3(
					Math.cos(rotation),
					Math.sin(rotation),
					0,
				);
				const distance = 1000;
				const target = bullet.getPosition().add(direction.mul(distance));

				bullet.animate(
					Property.Position,
					target,
					6,
					undefined,
					undefined,
					undefined,
					() => {
						bullet.delete();
					},
				);

				bullet.physics.setHandler(PhysicsGroup.wall, () => {
					bullet.delete();
				});
			});
		});
	}
}
