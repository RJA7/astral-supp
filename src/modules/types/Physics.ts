import { patchEnum, toHash } from '../utils/PatchEnum';
import { GameObjectId } from '../engine/types/Hash';

export enum PhysicsEventType {
	trigger_event = 'trigger_event',
}
patchEnum(PhysicsEventType, toHash);

export enum PhysicsGroup {
	player = 'player',
	player_trigger = 'player_trigger',
	safe_zone = 'safe_zone',
	finish_zone = 'finish_zone',
	bullet = 'bullet',
	wall = 'wall',
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
