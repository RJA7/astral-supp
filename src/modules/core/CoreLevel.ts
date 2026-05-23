import { CoreLayout } from '../layouts/CoreLayout';
import { CorePhysics } from './CorePhysics';
import { Level } from './levels/Level';
import { Player } from './entities/Player';
import { Cursor } from './entities/Cursor';
import { safeZoneSchema } from '../layouts/SafeZoneLayout';
import { syncSafeZoneCollider } from './helpers/SyncSafeZoneCollider';
import { levels } from './data/levels';
import { levelSchema } from '../layouts/LevelLayout';

export class CoreLevel {
	private readonly coreLayout: CoreLayout;

	private readonly physics: CorePhysics;

	private level?: Level;

	constructor(coreLayout: CoreLayout, physics: CorePhysics) {
		this.coreLayout = coreLayout;
		this.physics = physics;
	}

	public startLevel(levelNumber: number): { player: Player; cursor: Cursor } {
		this.destroyCurrentLevel();

		const levelData = levels[levelNumber];
		const layout = this.coreLayout.root.level_factory.createLayout(levelSchema);

		const safeZones = levelData.safeZones.map((zoneData) => {
			const safeZone = layout.safe_zones.factory.create(safeZoneSchema);
			safeZone.setPosition2D(vmath.vector3(zoneData.x, zoneData.y, 0));
			safeZone.setScale2D(vmath.vector3(zoneData.width, zoneData.height, 1));
			if (zoneData.angle !== 0) {
				go.set(safeZone.id, 'euler.z', zoneData.angle);
			}
			syncSafeZoneCollider(safeZone);
			return safeZone;
		});

		layout.player.setPosition2D(
			vmath.vector3(levelData.playerPosition.x, levelData.playerPosition.y, 0),
		);
		layout.cursor.setPosition2D(
			vmath.vector3(levelData.playerPosition.x, levelData.playerPosition.y, 0),
		);
		layout.finish_zone.setPosition2D(
			vmath.vector3(levelData.finishZone.x, levelData.finishZone.y, 0),
		);
		layout.finish_zone.setScale2D(
			vmath.vector3(levelData.finishZone.width, levelData.finishZone.height, 1),
		);

		this.physics.setLayout(layout);

		this.level = new Level({ layout, safeZones, levelData });
		this.level.start();

		return {
			player: new Player(layout.player),
			cursor: new Cursor(layout.cursor),
		};
	}

	public resize(): void {}

	private destroyCurrentLevel(): void {
		if (!this.level) return;
		this.level.destroy();
		this.level.layout.root.delete();
		this.level = undefined;
	}
}
