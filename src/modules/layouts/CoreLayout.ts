import { CollectionSchema, CollectionLayout } from '../engine/Layout';
import { Sprite } from '../engine/components/Sprite';
import { BoxShape } from '../engine/shapes/BoxShape';
import { CollectionFactory } from '../engine/components/CollectionFactory';

export const coreSchema = {
	root: {
		level_factory: CollectionFactory,
	},
	player: {},
	player_center: {},
	cursor: {
		sprite: Sprite,
	},
	safe_zones: {},
	finish_zone: {
		sprite: Sprite,
		body: {
			box: BoxShape,
		},
	},
} satisfies CollectionSchema;

export type CoreLayout = CollectionLayout<typeof coreSchema>;

export type PlayerLayout = CoreLayout['player'];

export type CursorLayout = CoreLayout['cursor'];

export type FinishZoneLayout = CoreLayout['finish_zone'];
