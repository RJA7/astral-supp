import { Message } from '../modules/types/Message';
import { MessageId } from '../modules/types/MessageId';
import { ComponentUrl } from '../modules/engine/ComponentUrl';
import { ActionId } from '../modules/types/ActionId';
import { Action } from '../modules/types/Action';
import { Controller } from '../modules/types/Controller';
import { Controllers } from '../modules/Controllers';
import { PhysicsEvent } from '../modules/types/Physics';
import { Signal, SignalBinding } from '../modules/engine/Signal';
import { screen } from '../modules/engine/render/Screen';

type Self = {
	Controller: hash;
	controller: Controller;
	onMessage: Signal<Message>;
	resizeBinding: SignalBinding;
};

go.property('Controller', hash(''));

export function init(this: Self) {
	const Controller = Controllers.get(this.Controller);

	if (!Controller) {
		throw new Error(`Controller ${this.Controller} not found`);
	}

	this.controller = new Controller();
	this.onMessage = new Signal();

	this.resizeBinding = screen.onResize.addScript(this, () => {
		this.controller.onResize?.();
	});
	physics.set_event_listener(physics_listener);
}

export function final(this: Self) {
	this.onMessage.removeAll();
	this.resizeBinding.destroy();
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
	message.mid = messageId;
	this.onMessage.dispatch(message);
	this.controller.onMessage?.(message, sender);
}

export function on_input(this: Self, actionId: ActionId, action: Action) {
	this.controller.onInput?.(actionId, action);
}

export function on_reload(this: Self) {
	this.controller.onReload?.();
}

function physics_listener(this: Self, events: PhysicsEvent[]) {
	this.controller.physicsListener?.(events);
}
