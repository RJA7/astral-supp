import { CoreLayout } from '../layouts/CoreLayout';
import { Level, levels } from './levels/levels';
import { syncSafeZoneCollider } from './helpers/SyncSafeZoneCollider';

export class CoreLevel {
	private readonly coreLayout: CoreLayout;

	private level!: Level;

	constructor(coreLayout: CoreLayout) {
		this.coreLayout = coreLayout;
	}

	public startLevel(levelNumber: number) {
		this.destroyCurrentLevel();
		this.level = this.createLevel(levelNumber);
	}

	public resize() {
		// this.levelLayout.bg.sprite.width = screen.width;
		// this.levelLayout.bg.sprite.height = screen.height;
	}

	private createLevel(levelNumber: number) {
		const { player, cursor } = this.coreLayout;
		const { level_factory } = this.coreLayout.root;

		const level = new levels[levelNumber]({
			level_factory,
			levelNumber,
		});

		this.coreLayout.world.addChild(level.layout.root);
		level.layout.safe_zones.forEach(syncSafeZoneCollider);

		const playerPosition = level.layout.player_position.getWorldPosition();
		player.setScale2D(level.layout.root.getScale());
		player.setPosition2D(playerPosition);
		cursor.setPosition2D(playerPosition);

		level.start();

		return level;
	}

	private destroyCurrentLevel() {
		if (!this.level) return;

		this.level.destroy();
		this.level.layout.root.delete();
	}
}
