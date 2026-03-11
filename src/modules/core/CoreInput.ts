import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';

export class CoreInput {
	private readonly delta = vmath.vector3();

	private pointerDown = false;

	public isPointerDown(): boolean {
		return this.pointerDown;
	}

	public getDelta() {
		return this.delta;
	}

	public resetDelta() {
		this.delta.x = 0;
		this.delta.y = 0;
	}

	public onInput(actionId: ActionId, action: Action): void {
		if (actionId === ActionId.touch) {
			if (action.pressed) {
				this.pointerDown = true;
			}

			if (action.released) {
				this.pointerDown = false;
			}
		}

		this.delta.x = action.dx;
		this.delta.y = action.dy;
	}
}
