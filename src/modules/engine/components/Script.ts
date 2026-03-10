import { ComponentUrl, componentUrl } from '../ComponentUrl';
import { Fragment, GameObjectId } from '../types/Hash';
import { MessageId } from '../../types/MessageId';
import { postMessage } from '../PostMessage';
import { ControllerName } from '../../ControllerName';
import { SetControllerMessage } from '../../types/Message';
import { Signal, SignalBinding } from '../Signal';
import { Messenger } from '../Messenger';
import { Controllers } from '../../Controllers';
import { Controller } from '../../types/Controller';

export type ScriptBridge<
	N extends ControllerName,
	T = InstanceType<(typeof Controllers)[N]>,
> = {
	[K in keyof T]: T[K] extends Signal<infer U> ? (...args: U) => void : never;
};

export class Script<
	T extends ControllerName,
	C = InstanceType<(typeof Controllers)[T]>,
> {
	public readonly url: ComponentUrl;
	public readonly controllerName: T;
	public readonly bridge: ScriptBridge<T>;
	private binding: SignalBinding | undefined;

	constructor(url: ComponentUrl, controllerName: T) {
		this.url = url;
		this.bridge = {} as ScriptBridge<T>;
		this.controllerName = controllerName;
	}

	call<K extends Exclude<keyof C, keyof Controller>>(
		methodName: K,
		...args: C[K] extends (...args: infer U) => any ? U : never
	): void {
		postMessage(this.url, {
			mid: MessageId.ScriptBridgeCall,
			methodName: methodName as string,
			args,
		});
	}

	setController(props: SetControllerMessage<T>['props']) {
		postMessage(this.url, {
			mid: MessageId.SetController,
			controllerName: this.controllerName,
			props,
		});
	}

	connect(messenger: Messenger) {
		if (this.binding) return;

		postMessage(this.url, { mid: MessageId.ScriptBridgeConnect });

		this.binding = messenger.on(
			MessageId.ScriptBridgeEvent,
			(message, sender) => {
				if (sender !== this.url) return;

				this.bridge[message.eventName as keyof typeof this.bridge]?.(
					...message.args,
				);
			},
		);
	}

	disconnect() {
		postMessage(this.url, { mid: MessageId.ScriptBridgeDisconnect });
		this.binding?.destroy();
		this.binding = undefined;
	}
}
