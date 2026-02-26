import { Sprite } from '../engine/components/Sprite';
import { BoxShape } from '../engine/shapes/BoxShape';
import { CollectionLayout, CollectionSchema } from '../engine/layout/types';
import { body, list } from '../engine/layout/Elements';

export const levelSchema = {
	bg: {
		sprite: Sprite,
	},
	player_position: {},
	safe_zones: list({
		body: body({
			box: BoxShape,
		}),
		sprite: Sprite,
	}),
} satisfies CollectionSchema;

export type LevelLayout = CollectionLayout<typeof levelSchema>;

export type SafeZoneLayout = LevelLayout['safe_zones'][number];
