import { ComponentUrl } from './ComponentUrl';
import { GameObject } from './GameObject';
import { Ref } from '../types/Ref';
import { Message } from '../types/Message';
import { MessageId } from '../types/MessageId';

export class ProxyLoader {
	private current?: GameObject;

	private readonly proxyByName: Map<Ref, GameObject>;

	constructor(proxyRefs: Ref[]) {
		this.proxyByName = new Map(
			proxyRefs.map((ref) => {
				const go = new GameObject(ref);
				return [ref, go];
			}),
		);
	}

	loadProxy(proxyRef: Ref) {
		if (this.current) {
			this.current.disable();
			this.current.unload();
		}

		this.current = this.proxyByName.get(proxyRef)!;
		this.current.asyncLoad();
	}

	onMessage(message: Message, sender: ComponentUrl) {
		if (message.id === MessageId.LoadProxy) {
			this.loadProxy(message.proxyRef);
			return;
		}

		if (
			message.id === MessageId.proxy_loaded &&
			this.current &&
			sender === this.current.url
		) {
			this.current.enable();
		}
	}
}
