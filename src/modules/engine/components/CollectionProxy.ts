import { postMessageId } from '../PostMessage';
import { MessageId } from '../../types/MessageId';
import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { Fragment, GameObjectId } from '../types/GameObjectId';
import { Component } from './Component';

export class CollectionProxy implements Component {
	public readonly url: ComponentUrl;

	constructor(id: GameObjectId, fragment: Fragment) {
		this.url = componentUrl(id, fragment);
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
}
