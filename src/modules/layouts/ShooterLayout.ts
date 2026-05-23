import { GameObjectLayout, GameObjectSchema, Sprite } from '../engine';

export const shooterSchema = {
	sprite: Sprite,
} satisfies GameObjectSchema;

export type ShooterLayout = GameObjectLayout<typeof shooterSchema>;
