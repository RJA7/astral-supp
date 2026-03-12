export enum LevelPart {
	LT = 'LT',
	RT = 'RT',
	LB = 'LB',
	RB = 'RB',
}

export enum Color {
	Red = 'player_red',
	Yellow = 'player_yellow',
	Purple = 'player_purple',
	Green = 'player_green',
}

export enum PickupType {
	SlowDown = 'SlowDown',
	SpeedUp = 'SpeedUp',
}

export type LevelData = {
	colorByPart: Record<LevelPart, Color>;
	parts: Record<LevelPart, LevelPartData>;
};

export type LevelPartData = {
	portals: Record<string, PortalData>;
	pickups: Record<string, PickupData>;
};

export type PortalData = {
	targetPart: LevelPart;
};

export type PickupData = {
	type: PickupType;
	color: Color;
};
