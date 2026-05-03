import { body, BoxShape, GameObjectSchema, Sprite } from '../engine';

export const safeZoneSchema = {
	sprite: Sprite,
	body: body({
		box: BoxShape,
	}),
} satisfies GameObjectSchema;
