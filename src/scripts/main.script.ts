import { stateManager } from '../modules/state/StateManager';
import { StateName } from '../modules/state/StateName';
import { DESIGN_HEIGHT, DESIGN_WIDTH } from '../modules/data/constants';
import { input } from '../modules/systems/Input';
import { Action } from '../modules/types/Action';
import { Message } from '../modules/types/Message';
import { MessageId } from '../modules/types/MessageId';
import { ActionId } from '../modules/types/ActionId';

type Self = object;

export function init(this: Self) {
	go.set_position(vmath.vector3(DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2, 0));
	msg.post('.', 'acquire_input_focus');

	window.set_listener(window_callback);

	stateManager.init();
	stateManager.switch(StateName.Core);
}

export function update(this: Self, dt: number) {
	stateManager.update(dt);
}

export function on_message<ID extends MessageId>(
	this: Self,
	messageId: MessageId,
	message: Message<ID>,
	sender: url,
) {
	stateManager.onMessage(messageId, message, sender);
}

export function on_input(this: Self, actionId: ActionId, action: Action) {
	input.onInput(actionId, action);
}

function window_callback(
	this: Self,
	event: number,
	_data: { width: number; height: number } | object,
) {
	if (event === window.WINDOW_EVENT_RESIZED) {
		//
	}
}
