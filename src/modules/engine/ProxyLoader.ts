import { ComponentUrl } from './ComponentUrl';
import { Message } from '../types/Message';
import { MessageId } from '../types/MessageId';
import { CollectionProxy } from './components/CollectionProxy';

export class ProxyLoader {
	private current?: CollectionProxy;

	loadProxy(proxy: CollectionProxy) {
		if (this.current) {
			this.current.disable();
			this.current.unload();
		}

		this.current = proxy;
		this.current.asyncLoad();
	}

	onMessage(message: Message, sender: ComponentUrl) {
		if (
			message.mid === MessageId.proxy_loaded &&
			this.current &&
			sender === this.current.url
		) {
			this.current.enable();
		}
	}
}
