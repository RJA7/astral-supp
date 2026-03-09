import { Message } from '../modules/types/Message';
import { MessageId } from '../modules/types/MessageId';
import { ComponentUrl } from '../modules/engine/ComponentUrl';
import { ActionId } from '../modules/types/ActionId';
import { Action } from '../modules/types/Action';
import { SignalBinding } from '../modules/engine/Signal';
import { screen } from '../modules/engine/render/Screen';
import { Controller } from '../modules/types/Controller';
import { Controllers } from '../modules/Controllers';

type Self = {
	controller: Controller;
	instance: lua_script_instance.Instance;
	resizeBinding: SignalBinding;
};

export function init(this: Self) {
	this.instance = lua_script_instance.Get();

	this.resizeBinding = screen.onResize.add(() => {
		lua_script_instance.Set(this.instance);
		this.controller.onResize();
	});
}

export function final(this: Self) {
	this.resizeBinding.destroy();
	this.controller.messenger.final();
	this.controller.final();
}

export function update(this: Self, dt: number) {
	this.controller.update(dt);
	this.controller.tweener.update(dt);
}

export function on_message(
	this: Self,
	messageId: MessageId,
	message: Message,
	sender: ComponentUrl,
) {
	message.mid = messageId;

	if (message.mid === MessageId.SetController) {
		const Controller = Controllers[message.controllerName];

		if (!Controller) {
			throw new Error(`GuiController ${message.controllerName} not found`);
		}

		this.controller = new Controller();
	}

	this.controller.messenger.onMessage(message, sender);
}

export function on_input(this: Self, actionId: ActionId, action: Action) {
	this.controller.onInput(actionId, action);
}

export function on_reload(this: Self) {
	this.controller.onReload();
}
