import { GameObject } from '../../engine/GameObject';
import { clampMagnitude } from '../../utils/ClampMagnitude';

// Max jump per physics iteration. This limits how close safe zones can be
const MAX_SPEED = 10;
const SENSITIVITY = 0.2;

export class Player extends GameObject {
	public fixedUpdate(
		_dt: number,
		inputDelta: vmath.vector3,
		isPointerDown: boolean,
	) {
		if (!isPointerDown) return;

		let speed = inputDelta.mul(SENSITIVITY);
		speed = clampMagnitude(speed, MAX_SPEED);
		this.addPosition2D(speed);
	}
}
