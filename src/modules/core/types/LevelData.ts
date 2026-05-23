export type LevelData = {
	safeZones: SafeZoneData[];
	finishZone: FinishZoneData;
	playerPosition: PointData;
	shooters: ShooterData[];
};

export type SafeZoneData = RectZoneData & {
	id: string;
};

export type FinishZoneData = RectZoneData;

export type RectZoneData = {
	x: number;
	y: number;
	width: number;
	height: number;
	angle: number;
};

export type PointData = {
	x: number;
	y: number;
};

export type ShooterData = {
	x: number;
	y: number;
	angle: number;
	fireInterval: number; // fire interval in seconds
};
