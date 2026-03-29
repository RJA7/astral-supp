import { CoreLayout } from '../layouts/CoreLayout';
import { LevelLayout, levelSchema } from '../layouts/LevelLayout';
import { CoreState } from './CoreState';
import { Property } from '../engine/types/Property';
import { Playback } from '../engine/types/Playback';
import { bulletSchema } from '../layouts/BulletLayout';
import { DEG_TO_RAD } from '../engine/utils/Math';

export class CoreLevel {
	private readonly state: CoreState;

	private readonly coreLayout: CoreLayout;

	private levelLayout!: LevelLayout;

	constructor(state: CoreState, coreLayout: CoreLayout) {
		this.state = state;
		this.coreLayout = coreLayout;

		this.state.onLevelChanged.add(() => {
			this.levelLayout = this.createLevelLayout(this.state.levelNumber);
		});

		this.state.setLevel(1);
	}

	public resize() {
		// this.levelLayout.bg.sprite.width = screen.width;
		// this.levelLayout.bg.sprite.height = screen.height;
	}

	private createLevelLayout(levelNumber: number) {
		const { player, cursor } = this.coreLayout;
		const { level_factory, safe_zone_factory } = this.coreLayout.root;

		level_factory.setPrototype(`/main/levels/level_${levelNumber}.collectionc`);
		const levelLayout = level_factory.createLayout(levelSchema);
		this.levelLayout = levelLayout;
		this.coreLayout.world.addChild(levelLayout.root);

		levelLayout.safe_zones.forEach((safeZone) => {
			const size = safeZone.getScale();
			safeZone.setScale2D(vmath.vector3(1, 1, 1));
			safeZone.sprite.setSize(size);
			safeZone.body.box.set(size);
		});

		const playerPosition = this.levelLayout.player_position.getWorldPosition();
		player.setScale2D(this.levelLayout.root.getScale());
		player.setPosition2D(playerPosition);
		cursor.setPosition2D(playerPosition);

		this.setupShooter();

		return levelLayout;
	}

	private setupShooter() {
		const { shooter, bullets } = this.levelLayout;

		shooter.animate(
			Property.EulerZ,
			-360,
			6,
			undefined,
			0,
			Playback.PLAYBACK_LOOP_FORWARD,
		);

		timer.delay(0.4, true, () => {
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
			});
		});
	}
}
