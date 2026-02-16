export type LevelData = {
	safeZones: LevelZone[];
	finish: LevelZone;
	player: { x: number; y: number };
};

export type LevelZone = {
	x: number;
	y: number;
	width: number;
	height: number;
};
