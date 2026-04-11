import { CoreLayout } from '../layouts/CoreLayout';
import { CoreState } from './CoreState';
import { Level, levels } from './levels/levels';
import { syncSafeZoneCollider } from './helpers/SyncSafeAreaCollider';
import { storage } from '../services/Storage';

export class CoreLevel {
	private readonly state: CoreState;

	private readonly coreLayout: CoreLayout;

	private level!: Level;

	constructor(state: CoreState, coreLayout: CoreLayout) {
		this.state = state;
		this.coreLayout = coreLayout;

		this.state.onLevelChanged.add(() => {
			if (!!this.level) {
				this.level.destroy();
				this.level.layout.root.delete();
			}

			this.level = this.createLevel(this.state.levelNumber);
		});

		this.state.setLevel(storage.data.levelNumber);
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

		return level;
	}
}
