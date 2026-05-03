import {
	body,
	BoxShape,
	CollectionLayout,
	CollectionSchema,
	list,
	Sprite,
} from '../engine';

export const levelSchema = {
	root: {},
	safe_zones: list({
		sprite: Sprite,
		body: body({
			box: BoxShape,
		}),
	}),
	player_position: {},
} satisfies CollectionSchema;

export type LevelLayout = CollectionLayout<typeof levelSchema>;

export type SafeZoneLayout = LevelLayout['safe_zones'][number];
