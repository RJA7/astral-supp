import { Color, LevelData, LevelPart, PickupType } from '../types/LevelData';

export const level1: LevelData = {
	colorByPart: {
		[LevelPart.LT]: Color.Yellow,
		[LevelPart.RT]: Color.Purple,
		[LevelPart.RB]: Color.Red,
		[LevelPart.LB]: Color.Green,
	},
	parts: {
		[LevelPart.LT]: {
			portals: {
				portal0: {
					targetPart: LevelPart.LB,
				},
				portal1: {
					targetPart: LevelPart.RT,
				},
			},
			pickups: {
				pickup0: { type: PickupType.SpeedUp, color: Color.Yellow },
				pickup1: { type: PickupType.SlowDown, color: Color.Red },
			},
		},
		[LevelPart.RT]: {
			portals: {
				portal0: {
					targetPart: LevelPart.RB,
				},
				portal1: {
					targetPart: LevelPart.LT,
				},
			},
			pickups: {
				pickup0: { type: PickupType.SpeedUp, color: Color.Purple },
				pickup1: { type: PickupType.SlowDown, color: Color.Green },
			},
		},
		[LevelPart.RB]: {
			portals: {
				portal0: {
					targetPart: LevelPart.RT,
				},
				portal1: {
					targetPart: LevelPart.LB,
				},
			},
			pickups: {
				pickup0: { type: PickupType.SpeedUp, color: Color.Yellow },
				pickup1: { type: PickupType.SlowDown, color: Color.Red },
			},
		},
		[LevelPart.LB]: {
			portals: {
				portal0: {
					targetPart: LevelPart.LT,
				},
				portal1: {
					targetPart: LevelPart.RB,
				},
			},
			pickups: {
				pickup0: { type: PickupType.SpeedUp, color: Color.Purple },
				pickup1: { type: PickupType.SlowDown, color: Color.Green },
			},
		},
	},
};
