import { ActionId } from './ActionId';
import { Action } from './Action';
import { PhysicsEvent } from './Physics';
import { Messenger } from '../engine/Messenger';
import Tweener from '../engine/tweener/Tweener';
import { MessageId } from './MessageId';
import { Signal, SignalBinding } from '../engine/Signal';
import { postMessage } from '../engine/PostMessage';

export type ControllerClass = new (props: any) => Controller;

export class Controller {
	messenger: Messenger;
	tweener: Tweener;

	constructor() {
		this.messenger = new Messenger();
		this.tweener = new Tweener();

		this.messenger.on(MessageId.ScriptBridgeCall, (message) => {
			(this as any)[message.methodName](...message.args);
		});

		this.__handleScriptBridgeMessages();
	}

	private __handleScriptBridgeMessages() {
		const bindingsBySender = new Map<string, SignalBinding[]>();

		this.messenger.on(MessageId.ScriptBridgeConnect, (_message, sender) => {
			const bindings: SignalBinding[] = [];
			bindingsBySender.set(tostring(sender), bindings);

			Object.entries(this).forEach(([eventName, signal]) => {
				if (!(signal instanceof Signal)) return;

				const binding = signal.add((...args) => {
					postMessage(sender, {
						mid: MessageId.ScriptBridgeEvent,
						eventName,
						args,
					});
				});
				bindings.push(binding);
			});
		});

		this.messenger.on(MessageId.ScriptBridgeDisconnect, (_message, sender) => {
			const key = tostring(sender);
			const bindings = bindingsBySender.get(key);

			if (!bindings) return;

			bindingsBySender.delete(key);

			bindings.forEach((binding) => {
				binding.destroy();
			});
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
