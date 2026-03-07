import { Sprite } from '../engine/components/Sprite';
import { body } from '../engine/layout/Elements';
import { BoxShape } from '../engine/shapes/BoxShape';
import { GameObjectSchema } from '../engine/layout/types';

export const safeZoneSchema = {
	sprite: Sprite,
	body: body({
		box: BoxShape,
	}),
} satisfies GameObjectSchema;
