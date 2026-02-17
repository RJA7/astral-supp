import { clampMagnitude } from '../../utils/ClampMagnitude';
import { PlayerLayout } from '../../layouts/CoreLayout';

// Max jump per physics iteration. This limits how close safe zones can be
const MAX_SPEED = 10;
const SENSITIVITY = 0.2;

export class Player {
	private readonly layout: PlayerLayout;

	constructor(layout: PlayerLayout) {
		this.layout = layout;
	}

	public fixedUpdate(
		_dt: number,
		inputDelta: vmath.vector3,
		isPointerDown: boolean,
	) {
		if (!isPointerDown) return;

		let speed = inputDelta.mul(SENSITIVITY);
		speed = clampMagnitude(speed, MAX_SPEED);
		this.layout.addPosition2D(speed);
	}
}
