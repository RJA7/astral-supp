import { BaseState } from './BaseState';
import { Message } from '../../types/Message';
import { ActionId } from '../../types/ActionId';
import { Action } from '../../types/Action';
import { ComponentUrl } from '../ComponentUrl';

export class StateManager<T extends string> {
	private currentState?: BaseState;

	private readonly stateByName: Record<T, BaseState>;

	constructor(stateByName: Record<T, BaseState>) {
		this.stateByName = stateByName;
	}

	load(stateName: T) {
		this.currentState?.disable();
		this.currentState = this.stateByName[stateName];
		this.currentState.load();
	}

	enable() {
		this.currentState?.enable();
		this.resize();
	}

	update(dt: number) {
		this.currentState?.update(dt);
	}

	onMessage(message: Message, sender: ComponentUrl) {
		this.currentState?.onMessage(message, sender);
	}

	onInput(actionId: ActionId, action: Action) {
		this.currentState?.onInput(actionId, action);
	}

	resize() {
		this.currentState?.resize();
	}
}
