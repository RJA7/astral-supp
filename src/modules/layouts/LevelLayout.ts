import { Sprite } from '../engine/components/Sprite';
import { CollectionLayout, CollectionSchema } from '../engine/layout/types';
import { body, list } from '../engine/layout/Elements';
import { BoxShape } from '../engine/shapes/BoxShape';
import { Factory } from '../engine/components/Factory';

export const levelSchema = {
	root: {},
	safe_zones: list({
		sprite: Sprite,
		body: body({
			box: BoxShape,
		}),
	}),
	player_position: {},
	shooter: {},
	bullets: {
		factory: Factory,
	},
} satisfies CollectionSchema;

export type LevelLayout = CollectionLayout<typeof levelSchema>;
