import { StateManager } from '../modules/engine/state_manager/StateManager';
import { StateName } from '../modules/types/StateName';
import { Action } from '../modules/types/Action';
import { Message } from '../modules/types/Message';
import { MessageId } from '../modules/types/MessageId';
import { ActionId } from '../modules/types/ActionId';
import { ComponentUrl } from '../modules/engine/ComponentUrl';
import { CoreState } from '../modules/core/CoreState';
import { MenuState } from '../modules/menu/MenuState';
import { Ref } from '../modules/types/Ref';

type Self = {
	stateManager: StateManager<StateName>;
};

export function init(this: Self) {
	msg.post('.', 'acquire_input_focus');

	window.set_listener(window_callback);

	this.stateManager = new StateManager({
		[StateName.Core]: new CoreState(Ref.CoreProxy),
		[StateName.Menu]: new MenuState(Ref.MenuProxy),
	});

	this.stateManager.load(StateName.Core);
}

export function update(this: Self, dt: number) {
	this.stateManager.update(dt);
}

export function on_message(
	this: Self,
	messageId: MessageId,
	message: Message,
	sender: ComponentUrl,
) {
	message.id = messageId; // for engine messages

	if (message.id === MessageId.LoadState) {
		this.stateManager.load(message.stateName);
		return;
	}

	if (message.id === MessageId.proxy_loaded) {
		this.stateManager.enable();
		return;
	}

	this.stateManager.onMessage(message, sender);
}

export function on_input(this: Self, actionId: ActionId, action: Action) {
	this.stateManager.onInput(actionId, action);
}

function window_callback(
	this: Self,
	event: number,
	_data: { width: number; height: number } | object,
) {
	if (event === window.WINDOW_EVENT_RESIZED) {
		this.stateManager.resize();
	}
}
