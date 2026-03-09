import { ProxyLoader } from './engine/ProxyLoader';
import { Controller } from './types/Controller';
import { MainLayout, mainSchema } from './layouts/MainLayout';
import { createCollectionLayout } from './engine/layout/CollectionLayout';

export class MainController extends Controller {
	private readonly layout: MainLayout;

	private readonly proxyLoader: ProxyLoader;

	constructor() {
		super();

		this.layout = createCollectionLayout(mainSchema);
		this.layout.root.acquireInputFocus();

		this.proxyLoader = new ProxyLoader(this.messenger);
		this.proxyLoader.loadProxy(this.layout.root.proxy_core);
	}

	final() {
		this.layout.root.releaseInputFocus();
	}

	restart() {
		this.proxyLoader.loadProxy(this.layout.root.proxy_core);
	}
}
