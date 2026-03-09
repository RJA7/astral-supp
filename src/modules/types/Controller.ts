import { ActionId } from './ActionId';
import { Action } from './Action';
import { PhysicsEvent } from './Physics';
import { Messenger } from '../engine/Messenger';
import Tweener from '../engine/tweener/Tweener';
import { MessageId } from './MessageId';

export type ControllerClass = new () => Controller;

export class Controller {
	messenger: Messenger;
	tweener: Tweener;

	constructor() {
		this.messenger = new Messenger();
		this.tweener = new Tweener();

		this.messenger.on(MessageId.ScriptBridgeCall, (message) => {
			(this as any)[message.methodName](...message.args);
		});
	}

	final(): void {}

	update(_dt: number): void {}

	lateUpdate(_dt: number): void {}

	fixedUpdate(_dt: number): void {}

	onInput(_actionId: ActionId, _action: Action): void {}

	onReload(): void {}

	onResize(): void {}

	physicsListener(_events: PhysicsEvent[]): void {}
}
