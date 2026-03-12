import { patchEnum, toHash } from '../utils/PatchEnum';
import { GameObjectId } from '../engine/types/Hash';

export enum PhysicsEventType {
	trigger_event = 'trigger_event',
}
patchEnum(PhysicsEventType, toHash);

export enum PhysicsGroup {
	player = 'player',
	safe_zone = 'safe_zone',
	portal = 'portal',
	pickup = 'pickup',
}
patchEnum(PhysicsGroup, toHash);

export type PhysicsObject = {
	group: PhysicsGroup;
	id: GameObjectId;
};

export type TriggerEvent = {
	type: PhysicsEventType;
	a: PhysicsObject;
	b: PhysicsObject;
	enter: boolean;
};

export type PhysicsEvent = TriggerEvent;
