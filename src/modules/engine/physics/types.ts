import { patchEnum, toHash } from '../utils/PatchEnum';
import { GameObjectId } from '../types/Hash';
import { PhysicsGroup } from '../../enums/PhysicsGroup';

export enum PhysicsEventType {
	trigger_event = 'trigger_event',
}
patchEnum(PhysicsEventType, toHash);

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
