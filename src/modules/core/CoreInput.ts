import { Action, ActionId } from '../engine';

export class CoreInput {
	private readonly delta = vmath.vector3();

	private pointerDown = false;

	private middleClick = false;

	public isPointerDown(): boolean {
		return this.pointerDown;
	}

	public isMiddleClick(): boolean {
		return this.middleClick;
	}

	public resetMiddleClick(): void {
		this.middleClick = false;
	}

	public getDelta() {
		return this.delta;
	}

	public resetDelta() {
		this.delta.x = 0;
		this.delta.y = 0;
	}

	public resetPointerDown() {
		this.pointerDown = false;
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

		if (actionId === ActionId.middle_click && action.pressed) {
			this.middleClick = true;
			return;
		}

		if (action.screen_dx !== undefined) {
			this.delta.x = action.screen_dx;
			this.delta.y = action.screen_dy;
		}
	}
}
