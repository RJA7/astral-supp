import {
	body,
	BoxShape,
	GameObjectLayout,
	GameObjectSchema,
	Sprite,
} from '../engine';

export const safeZoneSchema = {
	sprite: Sprite,
	body: body({
		box: BoxShape,
	}),
} satisfies GameObjectSchema;

export type SafeZoneLayout = GameObjectLayout<typeof safeZoneSchema>;
