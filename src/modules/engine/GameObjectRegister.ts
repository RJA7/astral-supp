import { GameObjectId } from './types/Hash';
import { GameObject } from './GameObject';

export class GameObjectRegister {
	public readonly objects = new Map<GameObjectId, GameObject>();

	constructor() {
		// timer.delay(5 * 60, true, () => {
		// 	this.garbageCollect(); TODO
		// });
	}

	public add(gameObject: GameObject): void {
		this.objects.set(gameObject.id, gameObject);
	}

	public delete(gameObject: GameObject): void {
		this.objects.delete(gameObject.id);
	}

	private garbageCollect() {
		for (const gameObject of this.objects.values()) {
			if (go.exists(gameObject.id)) continue;
			this.objects.delete(gameObject.id);
		}
	}
}

export const gameObjectRegister = new GameObjectRegister();
