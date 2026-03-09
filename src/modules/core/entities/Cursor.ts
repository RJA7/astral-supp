import { Easing } from '../../engine/types/Easing';
import { Property, SpriteProperty } from '../../engine/types/Property';
import { clampMagnitude } from '../../utils/ClampMagnitude';
import { CursorLayout } from '../../layouts/CoreLayout';

const MAX_CURSOR_OFFSET = 25;
const CURSOR_FOLLOW = 0.1;

export class Cursor {
	public readonly layout: CursorLayout;

	private cursorOffset = vmath.vector3();

	private visible = true;

	constructor(layout: CursorLayout) {
		this.layout = layout;
		this.setMouseLocked(true);
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
		this.layout.setPosition2D(playerPos.add(this.cursorOffset));
	}

	private setVisible(value: boolean) {
		if (value === this.visible) return;
		this.visible = value;

		const { sprite } = this.layout;
		sprite.cancelAnimation(SpriteProperty.Alpha);
		sprite.animate(SpriteProperty.Alpha, value ? 1 : 0, 0.1);

		const scale = value ? 1 : 0.6;
		const easing = value ? Easing.OUTSINE : Easing.INSINE;
		this.layout.animate(Property.Scale, scale, 0.3, easing);

		const alpha = value ? 1 : 0;
		const delay = value ? 0 : 0.2;
		const asset = value ? 'cursor_hand' : 'cursor_grab';
		sprite.cancelAnimation(SpriteProperty.Alpha);
		sprite.animate(SpriteProperty.Alpha, alpha, 0.1, Easing.LINEAR, delay);
		sprite.playFlipBook(asset);
	}

	public setMouseLocked(value: boolean) {
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
