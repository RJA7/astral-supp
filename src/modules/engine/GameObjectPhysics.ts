import { PhysicsEvent, PhysicsGroup } from '../types/Physics';

export type CollisionHandler = (event: PhysicsEvent) => void;

export class GameObjectPhysics {
	public readonly handlers = new Map<PhysicsGroup, CollisionHandler>();

	setHandler(otherGroup: PhysicsGroup, handler: CollisionHandler) {
		this.handlers.set(otherGroup, handler);
	}

	deleteHandler(otherGroup: PhysicsGroup) {
		this.handlers.delete(otherGroup);
	}
}
