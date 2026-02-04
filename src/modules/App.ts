import { ProxyLoader } from './engine/ProxyLoader';
import { GameObject } from './engine/GameObject';
import { Ref } from './types/Ref';
import { Message } from './types/Message';
import { ComponentUrl } from './engine/ComponentUrl';
import { Controller } from './types/Controller';

export class App extends GameObject implements Controller {
	private readonly proxyLoader: ProxyLoader;

	constructor(ref: Ref) {
		super(ref);

		this.proxyLoader = new ProxyLoader([Ref.CoreProxy, Ref.MenuProxy]);
		this.proxyLoader.loadProxy(Ref.CoreProxy);
	}

	onMessage(message: Message, sender: ComponentUrl) {
		this.proxyLoader.onMessage(message, sender);
	}
}
