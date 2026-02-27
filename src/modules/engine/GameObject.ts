import { ComponentUrl } from './ComponentUrl';
import { postVoidMessage } from './PostMessage';
import { MessageId } from '../types/MessageId';
import { Playback } from './types/Playback';
import { Property } from './types/Property';
import { Easing } from './types/Easing';
import { GameObjectId } from './types/Hash';

export class GameObject {
	public readonly id: GameObjectId;

	constructor(id: GameObjectId) {
		if (!go.exists(id)) {
			throw new Error(
				`GameObject with id ${id} does not exist in ${msg.url().socket}`,
			);
		}

		this.id = id;
	}

	getPosition() {
		return go.get_position(this.id);
	}

	setPosition(position: vmath.vector3) {
		go.set_position(position, this.id);
	}

	setPosition2D(position: vmath.vector3 | vmath.vector4) {
		go.set_position(
			vmath.vector3(position.x, position.y, this.getPosition().z),
			this.id,
		);
	}

	addPosition2D(position: vmath.vector3) {
		this.setPosition2D(this.getPosition().add(position));
	}

	getScale(): vmath.vector3 {
		return go.get_scale(this.id);
	}

	setScale(scale: vmath.vector3) {
		go.set_scale(scale, this.id);
	}

	setScale2D(scale: vmath.vector3) {
		go.set_scale_xy(scale, this.id);
	}

	enable() {
		postVoidMessage(this.id, MessageId.enable);
	}

	disable() {
		postVoidMessage(this.id, MessageId.disable);
	}

	acquireInputFocus(): void {
		postVoidMessage(this.id, MessageId.acquire_input_focus);
	}

	releaseInputFocus(): void {
		postVoidMessage(this.id, MessageId.release_input_focus);
	}

	animate(
		property: Property,
		to: number | vmath.vector3 | vmath.vector4 | vmath.quaternion,
		duration: number,
		easing:
			| Easing
			| vmath.vector3
			| vmath.vector4
			| vmath.quaternion
			| ReturnType<typeof vmath.vector> = Easing.LINEAR,
		delay: number = 0,
		playback: Playback = Playback.PLAYBACK_ONCE_FORWARD,
		completeFunction?: (url: ComponentUrl, property: Property) => void,
	) {
		go.animate(
			this.id,
			property,
			go[playback],
			to,
			typeof easing === 'string' ? go[easing] : easing,
			duration,
			delay,
			this.wrapAnimationComplete(completeFunction),
		);
	}

	cancelAnimation(property: Property | hash) {
		go.cancel_animations(this.id, property);
	}

	cancelAnimations() {
		go.cancel_animations(this.id);
	}

	setParent(parent: GameObject) {
		go.set_parent(this.id, parent.id);
	}

	addChild(child: GameObject) {
		go.set_parent(child.id, this.id);
	}

	private wrapAnimationComplete(
		complete?: (url: ComponentUrl, property: Property) => void,
	) {
		if (!complete) return;

		return function (this: object, url: ComponentUrl, property: string | hash) {
			complete(url, property as Property);
		};
	}
}
