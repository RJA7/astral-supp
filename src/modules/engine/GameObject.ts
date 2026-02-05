import { Ref } from '../types/Ref';
import { componentUrl, ComponentUrl } from './ComponentUrl';
import { postMessageId } from './PostMessage';
import { MessageId } from '../types/MessageId';
import { Playback } from './types/Playback';
import { Property } from './types/Property';
import { Easing } from './types/Easing';
import { AnimationDoneMessage } from '../types/Message';

export class GameObject {
	public readonly ref: Ref;
	public readonly url: ComponentUrl;

	constructor(ref: Ref) {
		this.ref = ref;
		this.url = componentUrl(ref);
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

	getAlpha() {
		return go.get(this.url, Property.Alpha);
	}

	setAlpha(value: number) {
		go.set(this.url, Property.Alpha, value);
	}

	enable() {
		postMessageId(this.url, MessageId.enable);
	}

	disable() {
		postMessageId(this.url, MessageId.disable);
	}

	asyncLoad(): void {
		postMessageId(this.url, MessageId.async_load);
	}

	load(): void {
		postMessageId(this.url, MessageId.load);
	}

	unload(): void {
		postMessageId(this.url, MessageId.unload);
	}

	acquireInputFocus(): void {
		postMessageId(this.url, MessageId.acquire_input_focus);
	}

	release_input_focus(): void {
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
		playback: Playback = Playback.PLAYBACK_ONCE_FORWARD,
		delay: number = 0,
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

	setImage(imageId: string) {
		go.set(this.url, 'image', imageId);
	}

	playFlipBook(
		id: string | hash,
		completeFunction?: (
			this: object,
			messageId: MessageId,
			message: AnimationDoneMessage,
			sender: ComponentUrl,
		) => void,
		playProperties: { offset?: number; playback_rate?: number } = {},
	) {
		sprite.play_flipbook(
			this.url,
			id,
			// @ts-expect-error casting url
			completeFunction,
			playProperties,
		);
	}

	getChild(name: string) {
		const ref = `${this.ref}#${name}` as Ref;
		return new GameObject(ref);
	}
}
