import { LevelData } from '../../types/LevelData';

// Safe zones ordered alphabetically by ID (how Defold indexes factory children):
// safe_zone0, safe_zone1, safe_zone10, safe_zone11, safe_zone12, safe_zone13, safe_zone14,
// safe_zone15, safe_zone16, safe_zone17, safe_zone18, safe_zone19, safe_zone2, safe_zone20,
// safe_zone21, safe_zone3, safe_zone4, safe_zone5, safe_zone6, safe_zone7, safe_zone8, safe_zone9
// Static zones (start visible at 60): indices 0, 7, 8, 15, 16
export default {
	safeZones: [
		{ id: 'sz0', x: -360, y: 0, width: 60, height: 60, angle: 0 }, // safe_zone0  idx 0  static
		{
			id: 'sz1',
			x: -300,
			y: 0,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 1: show t=0.5, hide t=2.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 0.5, value: 0 },
						{ time: 1.0, value: 60 },
						{ time: 2.5, value: 60 },
						{ time: 3.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone1  idx 1
		{
			id: 'sz2',
			x: -60,
			y: -60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 2: show t=1.5, hide t=4.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 1.5, value: 0 },
						{ time: 2.0, value: 60 },
						{ time: 4.5, value: 60 },
						{ time: 5.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone10 idx 2
		{
			id: 'sz3',
			x: 0,
			y: -60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 3: show t=1.5, hide t=8.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 1.5, value: 0 },
						{ time: 2.0, value: 60 },
						{ time: 8.5, value: 60 },
						{ time: 9.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone11 idx 3
		{
			id: 'sz4',
			x: 60,
			y: -60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 4: show t=3.5, hide t=6.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 3.5, value: 0 },
						{ time: 4.0, value: 60 },
						{ time: 6.5, value: 60 },
						{ time: 7.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone12 idx 4
		{
			id: 'sz5',
			x: 60,
			y: 0,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 5: show t=5.5, stays visible
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 5.5, value: 0 },
						{ time: 6.0, value: 60 },
					],
					loop: false,
				},
			],
		}, // safe_zone13 idx 5
		{
			id: 'sz6',
			x: 60,
			y: 60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 6: show t=5.5, hide t=16.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 5.5, value: 0 },
						{ time: 6.0, value: 60 },
						{ time: 16.5, value: 60 },
						{ time: 17.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone14 idx 6
		{
			id: 'sz7',
			x: 120,
			y: 60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 7 (static, starts 60): hide t=11.5
				{
					property: 'scale',
					keyframes: [
						{ time: 11.5, value: 60 },
						{ time: 12.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone15 idx 7  static
		{
			id: 'sz8',
			x: 180,
			y: 60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 8 (static, starts 60): hide t=13.5
				{
					property: 'scale',
					keyframes: [
						{ time: 13.5, value: 60 },
						{ time: 14.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone16 idx 8  static
		{
			id: 'sz9',
			x: 180,
			y: 0,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 9: show t=9.5, stays visible
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 9.5, value: 0 },
						{ time: 10.0, value: 60 },
					],
					loop: false,
				},
			],
		}, // safe_zone17 idx 9
		{
			id: 'sz10',
			x: 180,
			y: -60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 10: show t=10.5, hide t=15.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 10.5, value: 0 },
						{ time: 11.0, value: 60 },
						{ time: 15.5, value: 60 },
						{ time: 16.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone18 idx 10
		{
			id: 'sz11',
			x: 240,
			y: -60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 11: show t=12.5, hide t=18.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 12.5, value: 0 },
						{ time: 13.0, value: 60 },
						{ time: 18.5, value: 60 },
						{ time: 19.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone19 idx 11
		{
			id: 'sz12',
			x: -300,
			y: -60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 12: show t=14.5, hide t=22.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 14.5, value: 0 },
						{ time: 15.0, value: 60 },
						{ time: 22.5, value: 60 },
						{ time: 23.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone2  idx 12
		{
			id: 'sz13',
			x: 300,
			y: -60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 13: show t=14.5, stays visible
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 14.5, value: 0 },
						{ time: 15.0, value: 60 },
					],
					loop: false,
				},
			],
		}, // safe_zone20 idx 13
		{
			id: 'sz14',
			x: 300,
			y: 0,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 14: show t=17.5, hide t=20.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 17.5, value: 0 },
						{ time: 18.0, value: 60 },
						{ time: 20.5, value: 60 },
						{ time: 21.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone21 idx 14
		{
			id: 'sz15',
			x: -240,
			y: -60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 15 (static, starts 60): hide t=24.5
				{
					property: 'scale',
					keyframes: [
						{ time: 24.5, value: 60 },
						{ time: 25.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone3  idx 15 static
		{ id: 'sz16', x: -180, y: -60, width: 60, height: 60, angle: 0 }, // safe_zone4  idx 16 static
		{
			id: 'sz17',
			x: -180,
			y: 0,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 17: show t=21.5, hide t=26.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 21.5, value: 0 },
						{ time: 22.0, value: 60 },
						{ time: 26.5, value: 60 },
						{ time: 27.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone5  idx 17
		{
			id: 'sz18',
			x: -180,
			y: 60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 18: show t=23.5, hide t=28.5
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 23.5, value: 0 },
						{ time: 24.0, value: 60 },
						{ time: 28.5, value: 60 },
						{ time: 29.0, value: 0 },
					],
					loop: false,
				},
			],
		}, // safe_zone6  idx 18
		{
			id: 'sz19',
			x: -120,
			y: 60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 19: show t=23.5, stays visible
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 23.5, value: 0 },
						{ time: 24.0, value: 60 },
					],
					loop: false,
				},
			],
		}, // safe_zone7  idx 19
		{
			id: 'sz20',
			x: -60,
			y: 60,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 20: show t=25.5, stays visible
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 25.5, value: 0 },
						{ time: 26.0, value: 60 },
					],
					loop: false,
				},
			],
		}, // safe_zone8  idx 20
		{
			id: 'sz21',
			x: -60,
			y: 0,
			width: 60,
			height: 60,
			angle: 0,
			animations: [
				// idx 21: show t=27.5, stays visible
				{
					property: 'scale',
					keyframes: [
						{ time: 0, value: 0 },
						{ time: 27.5, value: 0 },
						{ time: 28.0, value: 60 },
					],
					loop: false,
				},
			],
		}, // safe_zone9  idx 21
	],
	finishZone: { x: 360, y: 0, width: 60, height: 60, angle: 0 },
	playerPosition: { x: -360, y: 0 },
	shooters: [],
	walls: [],
} satisfies LevelData;
