import { GameObject } from '../../engine/GameObject';
import { Easing } from '../../engine/types/Easing';
import { Property } from '../../engine/types/Property';
import { Ref } from '../../types/Ref';
import { clampMagnitude } from '../../utils/ClampMagnitude';

const MAX_CURSOR_OFFSET = 25;
const CURSOR_FOLLOW = 0.1;

export class Cursor extends GameObject {
	public readonly sprite: GameObject;

	private cursorOffset = vmath.vector3();

	private visible = true;

	constructor(ref: Ref) {
		super(ref);

		this.sprite = this.getChild('sprite');
		// this.setMouseLocked(true);
	}

	public update(
		playerPos: vmath.vector3,
		inputDelta: vmath.vector3,
		isPointerDown: boolean,
	) {
		if (!isPointerDown) {
			this.followPointer(inputDelta);
		}

		this.setVisible(!isPointerDown);
		this.setPosition2D(playerPos.add(this.cursorOffset));
	}

	private setVisible(value: boolean) {
		if (value === this.visible) return;
		this.visible = value;

		this.sprite.cancelAnimation(Property.Alpha);
		this.sprite.animate(Property.Alpha, value ? 1 : 0, 0.1);

		const scale = value ? 1 : 0.6;
		const easing = value ? Easing.OUTSINE : Easing.INSINE;
		this.animate(Property.Scale, scale, 0.3, easing);

		const alpha = value ? 1 : 0;
		const delay = value ? 0 : 0.2;
		const asset = value ? 'cursor_hand' : 'cursor_grab';
		this.sprite.cancelAnimation(Property.Alpha);
		this.sprite.animate(Property.Alpha, alpha, 0.1, Easing.LINEAR, delay);
		this.sprite.playFlipBook(asset);
	}

	private setMouseLocked(value: boolean) {
		window.set_mouse_lock(value);
	}

	private followPointer(inputDelta: vmath.vector3) {
		let offset = this.cursorOffset.add(inputDelta);
		offset = clampMagnitude(offset, MAX_CURSOR_OFFSET);

		this.cursorOffset = vmath.lerp(
			CURSOR_FOLLOW,
			this.cursorOffset,
			offset,
		) as vmath.vector3;
	}
}
