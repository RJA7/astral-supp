import { postVoidMessage } from '../PostMessage';
import { MessageId } from '../../types/MessageId';
import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { Fragment, GameObjectId } from '../types/Hash';
import { Component } from './Component';

export class CollectionProxy implements Component {
	public readonly url: ComponentUrl;

	constructor(id: GameObjectId, fragment: Fragment) {
		this.url = componentUrl(id, fragment, true);
	}

	enable() {
		postVoidMessage(this.url, MessageId.enable);
	}

	disable() {
		postVoidMessage(this.url, MessageId.disable);
	}

	asyncLoad(): void {
		postVoidMessage(this.url, MessageId.async_load);
	}

	load(): void {
		postVoidMessage(this.url, MessageId.load);
	}

	unload(): void {
		postVoidMessage(this.url, MessageId.unload);
	}
}
