import { ComponentUrl } from './ComponentUrl';
import { VoidMessage } from '../types/Message';
import { MessageId } from '../types/MessageId';
import { CollectionProxy } from './components/CollectionProxy';
import { Messenger } from './Messenger';

export class ProxyLoader {
	private current?: CollectionProxy<any>;
	private readonly messenger: Messenger;

	constructor(messenger: Messenger) {
		this.messenger = messenger;
		messenger.on(MessageId.proxy_loaded, this.handleProxyLoaded);
	}

	loadProxy(proxy: CollectionProxy<any>) {
		if (this.current) {
			this.current.disable();
			this.current.unload();
			this.current.script.disconnect();
		}

		this.current = proxy;
		this.current.asyncLoad();
	}

	private readonly handleProxyLoaded = (
		_message: VoidMessage,
		sender: ComponentUrl,
	) => {
		if (!this.current || sender !== this.current.url) return;

		this.current.enable();
		this.current.script.connect(this.messenger);
	};
}
