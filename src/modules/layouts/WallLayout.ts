import {
	body,
	BoxShape,
	GameObjectLayout,
	GameObjectSchema,
	Sprite,
} from '../engine';

export const wallSchema = {
	sprite: Sprite,
	body: body({
		box: BoxShape,
	}),
} satisfies GameObjectSchema;

export type WallLayout = GameObjectLayout<typeof wallSchema>;
