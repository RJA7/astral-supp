import { Sprite } from '../engine/components/Sprite';
import { CollectionFactory } from '../engine/components/CollectionFactory';
import { CollectionLayout, CollectionSchema } from '../engine/layout/types';
import { Factory } from '../engine/components/Factory';
import { Script } from '../engine/components/Script';

export const coreSchema = {
	root: {
		level_factory: CollectionFactory,
		safe_zone_factory: Factory,
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
	gui: {
		core: Script,
	},
} satisfies CollectionSchema;

export type CoreLayout = CollectionLayout<typeof coreSchema>;

export type PlayerLayout = CoreLayout['player'];

export type CursorLayout = CoreLayout['cursor'];
