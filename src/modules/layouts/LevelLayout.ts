import { CollectionLayout, CollectionSchema, list } from '../engine/Layout';
import { Sprite } from '../engine/components/Sprite';
import { BoxShape } from '../engine/shapes/BoxShape';

export const levelSchema = {
	bg: {
		sprite: Sprite,
	},
	player_position: {},
	safe_zones: list({
		body: {
			box: BoxShape,
		},
		sprite: Sprite,
	}),
	finish_zone: {
		body: {
			box: BoxShape,
		},
		sprite: Sprite,
	},
} satisfies CollectionSchema;

export type LevelLayout = CollectionLayout<typeof levelSchema>;

export type SafeZoneLayout = LevelLayout['safe_zones'][number];
