import { LevelData } from './types';
import { SafeZone } from './entities/SafeZone';
import { FinishZone } from './entities/FinishZone';
import { CoreLayout } from '../layouts/CoreLayout';
import { safeZoneSchema } from '../layouts/SafeZoneLayout';

export class CoreLevel {
	private readonly data: LevelData;

	private readonly finishZone: FinishZone;

	constructor(layout: CoreLayout, data: LevelData) {
		this.data = data;

		this.finishZone = new FinishZone(layout.finish_zone, data.finish);

		for (const safeZoneData of this.data.safeZones) {
			const safeZoneLayout = layout.safe_zones.factory.create(safeZoneSchema);
			const safeZone = new SafeZone(safeZoneLayout);
			safeZone.setData(safeZoneData);
		}
	}

	public getPlayerPosition() {
		return vmath.vector3(this.data.player.x, this.data.player.y, 0);
	}
}
