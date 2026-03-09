import { Controller } from '../types/Controller';
import { postMessage } from './PostMessage';
import { MessageId } from '../types/MessageId';
import { ComponentUrl } from './ComponentUrl';
import { ControllerName } from '../ControllerName';
import { Controllers } from '../Controllers';

export class ScriptBridge<
	N extends ControllerName,
	T = InstanceType<(typeof Controllers)[N]>,
> {
	private readonly url: ComponentUrl;

	constructor(url: ComponentUrl | string) {
		this.url = typeof url === 'string' ? (msg.url(url) as ComponentUrl) : url;
	}

	call<K extends Exclude<keyof T, keyof Controller>>(
		methodName: K,
		...args: T[K] extends (...args: infer U) => any ? U : never
	): void {
		postMessage(this.url, {
			mid: MessageId.ScriptBridgeCall,
			methodName: methodName as string,
			args,
		});
	}
}
