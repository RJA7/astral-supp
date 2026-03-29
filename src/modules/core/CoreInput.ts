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
				this.delta.x = 0;
				this.delta.y = 0;
				this.pointerDown = true;

				return;
			}

			if (action.released) {
				this.delta.x = 0;
				this.delta.y = 0;
				this.pointerDown = false;

				return;
			}
		}

		this.delta.x = action.screen_dx;
		this.delta.y = action.screen_dy;
	}
}
