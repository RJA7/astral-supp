import { MessageId } from '../../types/MessageId';
import { AnimationDoneMessage } from '../../types/Message';
import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { SpriteProperty } from '../types/Property';
import { Component } from './Component';
import { Fragment, GameObjectId, ImageResource, Material } from '../types/Hash';
import { Easing } from '../types/Easing';
import { Playback } from '../types/Playback';

export class Sprite implements Component {
	public readonly url: ComponentUrl;

	constructor(id: GameObjectId, fragment: Fragment) {
		this.url = componentUrl(id, fragment);
	}

	set width(value: number) {
		go.set(this.url, SpriteProperty.Width, value);
	}

	get width() {
		return go.get(this.url, SpriteProperty.Width) as number;
	}

	set height(value: number) {
		go.set(this.url, SpriteProperty.Height, value);
	}

	get height() {
		return go.get(this.url, SpriteProperty.Height) as number;
	}

	set alpha(value: number) {
		go.set(this.url, SpriteProperty.Alpha, value);
	}

	get alpha() {
		return go.get(this.url, SpriteProperty.Alpha) as number;
	}

	set image(value: ImageResource) {
		go.set(this.url, 'image', value);
	}

	get image() {
		return go.get(this.url, 'image') as ImageResource;
	}

	set material(value: Material) {
		go.set(this.url, 'material', value);
	}

	get material() {
		return go.get(this.url, 'material') as Material;
	}

	set size(value: vmath.vector3) {
		this.setSize(value);
	}

	get size() {
		return this.getSize();
	}

	setSize(value: vmath.vector3) {
		go.set(this.url, SpriteProperty.Size, value);
	}

	getSize(): vmath.vector3 {
		return go.get(this.url, SpriteProperty.Size) as vmath.vector3;
	}

	playFlipBook(
		id: string | hash,
		completeFunction?: (
			message: AnimationDoneMessage,
			sender: ComponentUrl,
		) => void,
		playProperties: { offset?: number; playback_rate?: number } = {},
	) {
		sprite.play_flipbook(
			this.url,
			id,
			this.wrapAnimationCompleteFunction(completeFunction),
			playProperties,
		);
	}

	animate(
		property: SpriteProperty,
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

	cancelAnimation(property: SpriteProperty) {
		go.cancel_animations(this.url, property);
	}

	cancelAnimations() {
		go.cancel_animations(this.url);
	}

	private wrapAnimationCompleteFunction(
		completeFunction?: (
			message: AnimationDoneMessage,
			sender: ComponentUrl,
		) => void,
	) {
		if (!completeFunction) return;

		return function (
			this: object,
			messageId: MessageId | hash,
			message: { current_tile: number; id: hash },
			sender: url,
		) {
			// @ts-expect-error
			message.mid = messageId;
			completeFunction(message as AnimationDoneMessage, sender as ComponentUrl);
		};
	}
}
