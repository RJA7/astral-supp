import {
	Action,
	ActionId,
	ComponentUrl,
	Controller,
	Message,
	MessageId,
	screen,
	SignalBinding,
} from '../modules/engine';
import { Controllers } from '../modules/Controllers';
import { ControllerName } from '../modules/enums/ControllerName';

type Self = {
	Controller: ControllerName;
	controller: Controller;
	instance: lua_script_instance.Instance;
	resizeBinding: SignalBinding;
};

go.property('Controller', hash(''));

export function init(this: Self) {
	this.instance = lua_script_instance.Get();

	const Controller = Controllers[this.Controller];

	if (!Controller) {
		throw new Error(`Controller ${this.Controller} not found`);
	}

	// @ts-ignore
	this.controller = new Controller();

	this.resizeBinding = screen.onResize.add(() => {
		lua_script_instance.Set(this.instance);
		this.controller.onResize();
	});

	msg.post('.', MessageId.acquire_input_focus);
}

export function final(this: Self) {
	this.resizeBinding.destroy();
	this.controller.messenger.final();
	this.controller.final();
	msg.post('.', MessageId.release_input_focus);
}

export function update(this: Self, dt: number) {
	this.controller.update(dt);
}

export function late_update(this: Self, dt: number) {
	this.controller.lateUpdate(dt);
}

export function fixed_update(this: Self, dt: number) {
	this.controller.fixedUpdate(dt);
}

export function on_message(
	this: Self,
	messageId: MessageId,
	message: Message,
	sender: ComponentUrl,
) {
	message.mid = messageId;
	this.controller.messenger.onMessage(message, sender);
}

export function on_input(this: Self, actionId: ActionId, action: Action) {
	this.controller.onInput(actionId, action);
	return true;
}

export function on_reload(this: Self) {
	this.controller.onReload();
}
