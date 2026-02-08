import { GameObject } from '../../engine/GameObject';
import { Easing } from '../../engine/types/Easing';
import { Property } from '../../engine/types/Property';
import { Ref } from '../../types/Ref';

export class Cursor extends GameObject {
	public readonly sprite: GameObject;

	constructor(ref: Ref) {
		super(ref);

		this.sprite = this.getChild('sprite');
	}

	show() {
		this.animate(Property.Scale, 1, 0.3, Easing.OUTSINE);

		this.sprite.cancelAnimation(Property.Alpha);
		this.sprite.animate(Property.Alpha, 1, 0.3);
		this.sprite.playFlipBook('cursor_hand');
	}

	hide() {
		this.animate(Property.Scale, 0.6, 0.2, Easing.INSINE);

		this.sprite.cancelAnimation(Property.Alpha);
		this.sprite.animate(Property.Alpha, 0, 0.1, undefined, undefined, 0.2);
		this.sprite.playFlipBook('cursor_grab');
	}

	setMouseLocked(_value: boolean) {
		// window.set_mouse_lock(value);
	}
}
