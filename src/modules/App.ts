import { StateManager } from './engine/state_manager/StateManager';
import { StateName } from './types/StateName';
import { GameObject } from './engine/GameObject';
import { Ref } from './types/Ref';
import { Message } from './types/Message';
import { ComponentUrl } from './engine/ComponentUrl';
import { MessageId } from './types/MessageId';

export class App {
	private readonly stateManager: StateManager<StateName>;

	constructor() {
		this.stateManager = new StateManager({
			[StateName.Core]: new GameObject(Ref.CoreProxy),
			[StateName.Menu]: new GameObject(Ref.MenuProxy),
		});

		this.stateManager.load(StateName.Core);
	}

	onMessage(message: Message, sender: ComponentUrl) {
		if (message.id === MessageId.LoadState) {
			this.stateManager.load(message.stateName);
			return;
		}

		if (message.id === MessageId.proxy_loaded) {
			this.stateManager.onProxyLoaded(sender);
			return;
		}
	}
}
