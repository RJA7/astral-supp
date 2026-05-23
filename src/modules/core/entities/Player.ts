import { PlayerLayout } from '../../layouts/LevelLayout';

// Max jump per physics iteration. This limits how close safe zones can be
const SENSITIVITY = 0.2;

export class Player {
	private readonly layout: PlayerLayout;

	constructor(layout: PlayerLayout) {
		this.layout = layout;
	}

	public getPosition(): vmath.vector3 {
		return this.layout.getPosition();
	}

	public fixedUpdate(
		_dt: number,
		inputDelta: vmath.vector3,
		isPointerDown: boolean,
	) {
		if (!isPointerDown) return;
		this.layout.addPosition2D(inputDelta.mul(SENSITIVITY));
	}
}
