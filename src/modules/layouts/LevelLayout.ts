import {
	CollectionLayout,
	CollectionSchema,
	Factory,
	list,
	Sprite,
} from '../engine';

export const levelSchema = {
	root: {},
	finish_zone: {},
	player: {},
	player_center: {},
	player_edges: list({}),
	cursor: {
		sprite: Sprite,
	},
	safe_zones: {
		factory: Factory,
	},
	shooters: {
		factory: Factory,
	},
	bullets: {
		factory: Factory,
	},
	walls: {
		factory: Factory,
	},
} satisfies CollectionSchema;

export type LevelLayout = CollectionLayout<typeof levelSchema>;

export type PlayerLayout = LevelLayout['player'];

export type CursorLayout = LevelLayout['cursor'];
