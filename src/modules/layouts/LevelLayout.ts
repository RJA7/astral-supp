import { CollectionLayout, CollectionSchema, list } from '../engine/Layout';
import { Sprite } from '../engine/components/Sprite';

export const levelSchema = {
	finish: {
		sprite: Sprite,
	},
	player_position: {},
	safe_zones: {
		sprites: list(Sprite, 'sprite'),
	},
} satisfies CollectionSchema;

export type LevelLayout = CollectionLayout<typeof levelSchema>;
