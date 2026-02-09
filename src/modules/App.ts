import { ProxyLoader } from './engine/ProxyLoader';
import { GameObject } from './engine/GameObject';
import { Ref } from './types/Ref';
import { Message } from './types/Message';
import { ComponentUrl } from './engine/ComponentUrl';
import { Controller } from './types/Controller';
import { postMessage } from './engine/PostMessage';
import { MessageId } from './types/MessageId';

export class App extends GameObject implements Controller {
	private readonly proxyLoader: ProxyLoader;

	constructor(ref: Ref) {
		super(ref);

		postMessage(Ref.Render, {
			mid: MessageId.UseFixedFitProjection,
			near: -100,
			far: 100,
		});

		this.proxyLoader = new ProxyLoader([Ref.CoreProxy, Ref.MenuProxy]);
		this.proxyLoader.loadProxy(Ref.CoreProxy);
	}

	onMessage(message: Message, sender: ComponentUrl) {
		this.proxyLoader.onMessage(message, sender);
	}
}
