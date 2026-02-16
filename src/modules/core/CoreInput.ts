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
