import { Sprite } from '../engine/components/Sprite';
import { CollectionFactory } from '../engine/components/CollectionFactory';
import { CollectionLayout, CollectionSchema } from '../engine/layout/types';
import { Factory } from '../engine/components/Factory';
import { list, spineModel } from '../engine/layout/Elements';
import { GameObject } from '../engine/GameObject';

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
} satisfies CollectionSchema;

export type CoreLayout = CollectionLayout<typeof coreSchema>;

export type PlayerLayout = CoreLayout['player'];

export type CursorLayout = CoreLayout['cursor'];
