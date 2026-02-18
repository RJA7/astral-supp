import { CollectionSchema, CollectionLayout } from '../engine/Layout';
import { Sprite } from '../engine/components/Sprite';
import { CollectionFactory } from '../engine/components/CollectionFactory';

export const coreSchema = {
	root: {
		level_factory: CollectionFactory,
	},
	world: {},
	player: {},
	player_center: {},
	cursor: {
		sprite: Sprite,
	},
	vignette: {
		sprite: Sprite,
	},
} satisfies CollectionSchema;

export type CoreLayout = CollectionLayout<typeof coreSchema>;

export type PlayerLayout = CoreLayout['player'];

export type CursorLayout = CoreLayout['cursor'];
