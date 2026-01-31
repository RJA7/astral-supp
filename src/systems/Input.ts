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

	private dispatch(actionId: ActionId, action: Action) {
		this.listeners.forEach((listener) => {
			postMessage(listener, MessageId.Input, { actionId, action });
		});
	}

	onInput(actionId: ActionId, action: Action) {
		if (
			actionId === ActionId.touch ||
			actionId === ActionId.mouse_button_1 ||
			actionId === ActionId.mouse_move
		) {
			this.dispatch(actionId, action);
		}
	}
}

export const input = new Input();
