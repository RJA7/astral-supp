import { Action } from '../types/Action';
import { postMessage } from './Message';
import { ActionId } from '../types/ActionId';
import { MessageId } from '../types/MessageId';

class Input {
	private listeners = new Set<url>();

	register(listener: url) {
		this.listeners.add(listener);
	}

	unregister(listener: url) {
		this.listeners.delete(listener);
	}

	onInput(actionId: ActionId, action: Action) {
		this.listeners.forEach((listener) => {
			postMessage(listener, MessageId.Input, { actionId, action });
		});
	}
}

export const input = new Input();
