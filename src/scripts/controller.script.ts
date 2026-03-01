import { Message } from '../modules/types/Message';
import { MessageId } from '../modules/types/MessageId';
import { ComponentUrl } from '../modules/engine/ComponentUrl';
import { ActionId } from '../modules/types/ActionId';
import { Action } from '../modules/types/Action';
import { Controller } from '../modules/types/Controller';
import { Controllers } from '../modules/Controllers';
import { PhysicsEvent } from '../modules/types/Physics';
import { SignalBinding } from '../modules/engine/Signal';
import { screen } from '../modules/engine/render/Screen';

type Self = {
	Controller: hash;
	controller: Controller;
	resizeBinding: SignalBinding;
};

go.property('Controller', hash(''));

export function init(this: Self) {
	const Controller = Controllers.get(this.Controller);

	if (!Controller) {
		throw new Error(`Controller ${this.Controller} not found`);
	}

	this.controller = new Controller();

	this.resizeBinding = screen.onResize.add(
		this.controller.messenger.wrapCrossScript(() => {
			this.controller.onResize();
		}),
	);
	physics.set_event_listener(physics_listener);
}

export function final(this: Self) {
	this.resizeBinding.destroy();
	this.controller.messenger.final();
	this.controller.final();
}

export function update(this: Self, dt: number) {
	this.controller.update(dt);
}

export function late_update(this: Self, dt: number) {
	this.controller.tweener.update(dt);
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
}

export function on_reload(this: Self) {
	this.controller.onReload();
}

function physics_listener(this: Self, events: PhysicsEvent[]) {
	this.controller.physicsListener(events);
}
