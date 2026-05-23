import { LevelData } from '../../types/LevelData';

export default {
	safeZones: [
		{ id: 'sz0', x: -508.3333, y: -53.0, width: 60, height: 500, angle: 0 },
		{ id: 'sz1', x: 11.6667, y: 166.6667, width: 1000, height: 60, angle: 0 },
		{ id: 'sz2', x: 488.3333, y: -53.3333, width: 60, height: 500, angle: 0 },
		{ id: 'sz3', x: 61.6667, y: -273.3333, width: 800, height: 60, angle: 0 },
		{ id: 'sz4', x: -368.3333, y: -103.3333, width: 60, height: 400, angle: 0 },
		{ id: 'sz5', x: 3.3333, y: 65.0, width: 800, height: 60, angle: 0 },
		{ id: 'sz6', x: 373.3333, y: -65.0, width: 60, height: 200, angle: 0 },
		{ id: 'sz7', x: 101.6667, y: -138.3333, width: 600, height: 60, angle: 0 },
	],
	finishZone: { x: -245, y: -119, width: 1, height: 1, angle: 0 },
	playerPosition: { x: -0.999969, y: 168.66669 },
	shooters: [
		{
			x: -1,
			y: -37,
			angle: 0,
			fireInterval: 0.5,
			bulletCount: 3,
			bulletSpread: 120,
			animations: [
				{
					property: 'euler.z',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 6, value: -360 },
					],
					loop: true,
					loopDuration: 6,
				},
			],
		},
	],
} satisfies LevelData;
