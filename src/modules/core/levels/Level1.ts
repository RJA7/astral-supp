import { LevelData, LevelPart } from '../types/LevelData';

export const level1: LevelData = {
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
		},
		[LevelPart.RT]: {
			portals: {
				portal0: {
					targetPart: LevelPart.LT,
				},
				portal1: {
					targetPart: LevelPart.RB,
				},
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
		},
		[LevelPart.LB]: {
			portals: {
				portal0: {
					targetPart: LevelPart.RB,
				},
				portal1: {
					targetPart: LevelPart.LT,
				},
			},
		},
	},
};
