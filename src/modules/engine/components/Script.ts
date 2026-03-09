import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { Component } from './Component';
import { Fragment, GameObjectId } from '../types/Hash';
import { Message, VoidMessageId } from '../../types/Message';

export class Script implements Component {
	public readonly url: ComponentUrl;

	constructor(id: GameObjectId, fragment: Fragment) {
		this.url = componentUrl(id, fragment, true);
	}

	postMessage(messageOrId: Message | VoidMessageId) {
		if (type(messageOrId) === 'table') {
			const message = messageOrId as Message;
			msg.post(this.url, message.mid, message);
		} else {
			msg.post(this.url, messageOrId as unknown as hash);
		}
	}
}
