import { Sprite } from '../engine/components/Sprite';
import { BoxShape } from '../engine/shapes/BoxShape';
import { CollectionLayout, CollectionSchema } from '../engine/layout/types';
import { body, list, spineModel } from '../engine/layout/Elements';
import { GameObject } from '../engine/GameObject';

export const levelSchema = {
	root: {
		spine_model: spineModel({
			safe_zones: list(GameObject),
		}),
	},
	player_position: {},
	safe_zones: list({
		body: body({
			box: BoxShape,
		}),
		sprite: Sprite,
	}),
	portals: list({}),
} satisfies CollectionSchema;

export type LevelLayout = CollectionLayout<typeof levelSchema>;

export type SafeZoneLayout = LevelLayout['safe_zones'][number];
