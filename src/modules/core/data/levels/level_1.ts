import { LevelData } from '../../types/LevelData';

export default {
	safeZones: [
		{ id: 'sz0', x: -475.3333, y: -202.0, width: 180, height: 200, angle: 0 },
		{
			id: 'sz1',
			x: -475.3333,
			y: 19.0,
			width: 180,
			height: 246.8,
			angle: 0,
			animations: [
				{
					property: 'scale.x',
					keyframes: [
						{ time: 0.5, value: 0.01 },
						{ time: 1.0, value: 180 },
					],
					loop: true,
					loopDuration: 1.5,
				},
			],
		},
		{
			id: 'sz2',
			x: -315.3333,
			y: 169.0,
			width: 500,
			height: 60,
			angle: 0,
			animations: [
				{
					property: 'scale.x',
					keyframes: [
						{ time: 1.0, value: 300 },
						{ time: 2.0, value: 500 },
					],
					loop: true,
					loopDuration: 3.0,
				},
				{
					property: 'position.x',
					keyframes: [
						{ time: 1.0, value: -415.3333 },
						{ time: 2.0, value: -315.3333 },
					],
					loop: true,
					loopDuration: 3.0,
				},
			],
		},
		{
			id: 'sz3',
			x: 264.6667,
			y: 169.0,
			width: 500,
			height: 60,
			angle: 0,
			animations: [
				{
					property: 'scale.x',
					keyframes: [
						{ time: 1.0, value: 700 },
						{ time: 2.0, value: 500 },
					],
					loop: true,
					loopDuration: 3.0,
				},
				{
					property: 'position.x',
					keyframes: [
						{ time: 1.0, value: 164.6667 },
						{ time: 2.0, value: 264.6667 },
					],
					loop: true,
					loopDuration: 3.0,
				},
			],
		},
		{ id: 'sz4', x: -115.3333, y: 248.0, width: 100, height: 100, angle: 0 },
		{ id: 'sz5', x: 464.6667, y: 116.0, width: 100, height: 50, angle: 0 },
		{
			id: 'sz6',
			x: 464.6667,
			y: 44.0,
			width: 100,
			height: 100,
			angle: 0,
			animations: [
				{
					property: 'scale.x',
					keyframes: [
						{ time: 0.5, value: 0.01 },
						{ time: 1.0, value: 100 },
					],
					loop: true,
					loopDuration: 2.0,
				},
			],
		},
		{
			id: 'sz7',
			x: 464.6667,
			y: -54.0,
			width: 100,
			height: 100,
			angle: 0,
			animations: [
				{
					property: 'scale.x',
					keyframes: [
						{ time: 0.5, value: 100 },
						{ time: 1.0, value: 0.01 },
						{ time: 1.5, value: 100 },
					],
					loop: true,
					loopDuration: 2.5,
				},
			],
		},
		{
			id: 'sz8',
			x: 464.6667,
			y: -152.0,
			width: 100,
			height: 100,
			angle: 0,
			animations: [
				{
					property: 'scale.x',
					keyframes: [
						{ time: 1.0, value: 100 },
						{ time: 1.5, value: 0.01 },
						{ time: 2.0, value: 100 },
					],
					loop: true,
					loopDuration: 3.0,
				},
			],
		},
	],
	finishZone: { x: 465, y: -250, width: 100, height: 100, angle: 0 },
	playerPosition: { x: -477.99997, y: -271.3333 },
	shooters: [],
	walls: [],
} satisfies LevelData;
