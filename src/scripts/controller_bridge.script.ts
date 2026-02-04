import { Message } from '../modules/types/Message';
import { MessageId } from '../modules/types/MessageId';
import { ComponentUrl } from '../modules/engine/ComponentUrl';
import { ActionId } from '../modules/types/ActionId';
import { Action } from '../modules/types/Action';
import { Ref } from '../modules/types/Ref';
import { Controller } from '../modules/types/Controller';
import { Controllers } from '../modules/Controllers';

type Self = {
	Controller: hash;
	controller: Controller;
};

go.property('Controller', hash(''));

export function init(this: Self) {
	const Controller = Controllers.get(this.Controller)!;
	this.controller = new Controller(Ref.CurrentGameObject);
	this.controller.acquireInputFocus();
}

export function final(this: Self) {
	this.controller.release_input_focus();
	this.controller.final?.();
}

export function update(this: Self, dt: number) {
	this.controller.update?.(dt);
}

export function late_update(this: Self, dt: number) {
	this.controller.lateUpdate?.(dt);
}

export function fixed_update(this: Self, dt: number) {
	this.controller.fixedUpdate?.(dt);
}

export function on_message(
	this: Self,
	messageId: MessageId,
	message: Message,
	sender: ComponentUrl,
) {
	// @ts-expect-error for engine messages like proxy_loaded
	message.id = messageId;
	this.controller.onMessage?.(message, sender);
}

export function on_input(this: Self, actionId: ActionId, action: Action) {
	this.controller.onInput?.(actionId, action);
}

export function on_reload(this: Self) {
	this.controller.onReload?.();
}
