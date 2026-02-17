import { componentUrl, ComponentUrl } from './ComponentUrl';
import { postMessageId } from './PostMessage';
import { MessageId } from '../types/MessageId';
import { Playback } from './types/Playback';
import { Property } from './types/Property';
import { Easing } from './types/Easing';
import { Fragment, GameObjectId } from './types/GameObjectId';

export class GameObject {
	public readonly url: ComponentUrl;

	constructor(id: GameObjectId, fragment?: Fragment) {
		this.url = componentUrl(id, fragment);
	}

	getId(): GameObjectId {
		return this.url.path;
	}

	getPosition() {
		return go.get_position(this.url);
	}

	setPosition(position: vmath.vector3) {
		go.set_position(position, this.url);
	}

	setPosition2D(position: vmath.vector3 | vmath.vector4) {
		go.set_position(
			vmath.vector3(position.x, position.y, this.getPosition().z),
			this.url,
		);
	}

	addPosition2D(position: vmath.vector3) {
		this.setPosition2D(this.getPosition().add(position));
	}

	enable() {
		postMessageId(this.url, MessageId.enable);
	}

	disable() {
		postMessageId(this.url, MessageId.disable);
	}

	acquireInputFocus(): void {
		postMessageId(this.url, MessageId.acquire_input_focus);
	}

	releaseInputFocus(): void {
		postMessageId(this.url, MessageId.release_input_focus);
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
		completeFunction?: (
			this: object,
			url: ComponentUrl,
			property: string | hash,
		) => void,
	) {
		go.animate(
			this.url,
			property,
			go[playback],
			to,
			typeof easing === 'string' ? go[easing] : easing,
			duration,
			delay,
			completeFunction,
		);
	}

	cancelAnimation(property: Property | hash) {
		go.cancel_animations(this.url, property);
	}

	cancelAnimations() {
		go.cancel_animations(this.url);
	}

	setParent(parent: GameObject) {
		go.set_parent(this.url, parent.url);
	}
}
