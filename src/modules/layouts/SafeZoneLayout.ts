import { GameObjectLayout, GameObjectSchema } from '../engine/Layout';
import { Sprite } from '../engine/components/Sprite';
import { BoxShape } from '../engine/shapes/BoxShape';

export const safeZoneSchema = {
	sprite: Sprite,
	body: {
		box: BoxShape,
	},
} satisfies GameObjectSchema;

export type SafeZoneLayout = GameObjectLayout<typeof safeZoneSchema>;
