import { LevelData } from './types';
import { Ref } from '../types/Ref';
import { SafeZone } from './entities/SafeZone';
import { GameObject } from '../engine/GameObject';
import { GameObjectId } from '../types/GameObjectId';
import { FinishZone } from './entities/FinishZone';

export class CoreLevel {
	private readonly data: LevelData;

	private readonly safeZonesFactory: GameObject;

	private readonly safeZones: GameObject;

	private readonly finishZone: FinishZone;

	constructor(data: LevelData) {
		this.data = data;

		this.safeZonesFactory = new GameObject(Ref.SafeZonesFactory);
		this.safeZones = new GameObject(GameObjectId.safe_zones);
		this.finishZone = new FinishZone(GameObjectId.finish_zone, data.finish);

		for (const safeZoneData of this.data.safeZones) {
			const safeZone = this.safeZonesFactory.createGameObject(SafeZone);
			safeZone.setData(safeZoneData);
			safeZone.setParent(this.safeZones);
		}
	}

	public getPlayerPosition() {
		return vmath.vector3(this.data.player.x, this.data.player.y, 0);
	}
}
