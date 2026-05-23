export type LevelData = {
	safeZones: SafeZoneData[];
	finishZone: FinishZoneData;
	playerPosition: PointData;
	shooters: ShooterData[];
};

export type AnimationTrack = {
	property: string; // "scale" | "scale.x" | "scale.y" | "position.x" | "position.y" | "euler.z"
	keyframes: AnimationKeyframe[];
	loop?: boolean;
	loopDuration?: number;
};

export type AnimationKeyframe = {
	time: number;
	value: number;
};

export type SafeZoneData = RectZoneData & {
	id: string;
	animations?: AnimationTrack[];
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
	fireInterval: number;
	bulletCount?: number;
	bulletSpread?: number;
	animations?: AnimationTrack[];
};
