export enum LevelPart {
	LT = 'LT',
	RT = 'RT',
	LB = 'LB',
	RB = 'RB',
}

export type LevelData = {
	parts: Record<LevelPart, LevelPartData>;
};

export type LevelPartData = {
	portals: Record<string, PortalData>;
};

export type PortalData = {
	targetPart: LevelPart;
};
