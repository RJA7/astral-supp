import { Sprite } from '../engine/components/Sprite';
import { body } from '../engine/layout/Elements';
import { GameObjectSchema } from '../engine/layout/types';
import { SphereShape } from '../engine/shapes/SphereShape';

export const bulletSchema = {
	sprite: Sprite,
	body: body({
		circle: SphereShape,
	}),
} satisfies GameObjectSchema;
