import { GameObject } from '../../engine/GameObject';

export class Cursor extends GameObject {
	show() {
		this.enable();
	}

	hide() {
		this.disable();
	}

	setMouseLocked(value: boolean) {
		window.set_mouse_lock(value);
	}
}
