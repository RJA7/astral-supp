import { GameObject } from '../GameObject';
import { MessageId } from '../../types/MessageId';
import { AnimationDoneMessage } from '../../types/Message';
import { ComponentUrl } from '../ComponentUrl';
import { Property } from '../types/Property';
import { Component } from './Component';
import { Fragment, GameObjectId } from '../types/GameObjectId';

export class Sprite extends GameObject implements Component {
	constructor(id: GameObjectId, fragment: Fragment) {
		super(id, fragment);
	}

	getAlpha() {
		return go.get(this.url, Property.Alpha);
	}

	setAlpha(value: number) {
		go.set(this.url, Property.Alpha, value);
	}

	setImage(imageId: string) {
		go.set(this.url, 'image', imageId);
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

	setSize(value: vmath.vector3) {
		go.set(this.url, Property.Size, value);
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
