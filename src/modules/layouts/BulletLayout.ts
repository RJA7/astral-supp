import { body, GameObjectSchema, SphereShape, Sprite } from '../engine';

export const bulletSchema = {
	sprite: Sprite,
	body: body({
		circle: SphereShape,
	}),
} satisfies GameObjectSchema;
