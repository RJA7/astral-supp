import { GuiProperty } from '../types/Property';
import { AnimateTo, AnyEasing, wrapAnimationComplete } from '../utils/Animate';
import { Easing } from '../types/Easing';
import { Playback } from '../types/Playback';

export class GuiNode {
	private readonly id: string;
	private readonly node: node;

	constructor(id: string) {
		this.id = id;
		this.node = gui.get_node(id);
	}

	getPosition() {
		return gui.get_position(this.node);
	}

	setPosition2D(position: vmath.vector3 | vmath.vector4) {
		gui.set_position(
			this.node,
			vmath.vector3(position.x, position.y, this.getPosition().z),
		);
	}

	set x(value: number) {
		const position = this.getPosition();
		position.x = value;
		gui.set_position(this.node, position);
	}

	get x() {
		return this.getPosition().x;
	}

	set y(value: number) {
		const position = this.getPosition();
		position.y = value;
		gui.set_position(this.node, position);
	}

	get y() {
		return this.getPosition().y;
	}

	set alpha(value: number) {
		gui.set_alpha(this.node, value);
	}

	get alpha() {
		return gui.get_alpha(this.node);
	}

	set text(value: string | number) {
		gui.set_text(this.node, value);
	}

	get text() {
		return gui.get_text(this.node);
	}

	pick(x: number, y: number) {
		return gui.pick_node(this.node, x, y);
	}

	animate(
		property: GuiProperty,
		to: AnimateTo,
		duration: number,
		easing: AnyEasing = Easing.Linear,
		delay: number = 0,
		playback: Playback = Playback.PLAYBACK_ONCE_FORWARD,
		complete?: (node: node) => void,
	) {
		gui.animate(
			this.node,
			property,
			to,
			typeof easing === 'string' ? gui[easing] : easing,
			duration,
			delay,
			wrapAnimationComplete(complete),
			gui[playback],
		);
	}

	cancelAnimation(property: GuiProperty) {
		gui.cancel_animations(this.node, property);
	}

	cancelAnimations() {
		gui.cancel_animations(this.node);
	}
}
