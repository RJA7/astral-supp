import { LevelData } from '../../types/LevelData';

export default {
	safeZones: [],
	finishZone: {
		x: 0,
		y: 0,
		width: 100,
		height: 100,
		angle: 0,
	},
	playerPosition: {
		x: 0,
		y: 0,
	},
	shooters: [],
} satisfies LevelData;
