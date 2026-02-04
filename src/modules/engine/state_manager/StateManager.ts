import { ComponentUrl } from '../ComponentUrl';
import { GameObject } from '../GameObject';

export class StateManager<T extends string> {
	private current?: GameObject;

	private readonly proxyByName: Record<T, GameObject>;

	constructor(stateByName: Record<T, GameObject>) {
		this.proxyByName = stateByName;
	}

	load(stateName: T) {
		if (this.current) {
			this.current.disable();
			this.current.unload();
		}

		this.current = this.proxyByName[stateName];
		this.current.load();
	}

	onProxyLoaded(sender: ComponentUrl) {
		if (!this.current || sender !== this.current.url) return;
		this.current.enable();
	}
}
