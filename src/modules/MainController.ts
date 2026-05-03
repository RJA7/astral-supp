import { Controller } from './engine';
import { createCollectionLayout, ProxyLoader } from './engine';
import { MainLayout, mainSchema } from './layouts/MainLayout';

export class MainController extends Controller {
	private readonly layout: MainLayout;

	private readonly proxyLoader: ProxyLoader;

	constructor() {
		super();

		this.layout = createCollectionLayout(mainSchema);
		this.proxyLoader = new ProxyLoader(this.messenger);

		const { proxy_core } = this.layout.root;

		this.proxyLoader.loadProxy(proxy_core);
		proxy_core.script.bridge.onRestart = () => this.restart();
	}

	restart() {
		const { proxy_core } = this.layout.root;
		this.proxyLoader.loadProxy(proxy_core);
	}
}
