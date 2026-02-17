import { ProxyLoader } from './engine/ProxyLoader';
import { Message } from './types/Message';
import { ComponentUrl } from './engine/ComponentUrl';
import { Controller } from './types/Controller';
import { MainLayout, mainSchema } from './layouts/MainLayout';
import { createCollectionLayout } from './engine/Layout';

export class MainController implements Controller {
	private readonly layout: MainLayout;

	private readonly proxyLoader: ProxyLoader;

	constructor() {
		this.layout = createCollectionLayout(mainSchema);
		this.layout.root.acquireInputFocus();

		this.proxyLoader = new ProxyLoader();
		this.proxyLoader.loadProxy(this.layout.root.proxy_core);
	}

	onMessage(message: Message, sender: ComponentUrl) {
		this.proxyLoader.onMessage(message, sender);
	}

	final() {
		this.layout.root.releaseInputFocus();
	}
}
