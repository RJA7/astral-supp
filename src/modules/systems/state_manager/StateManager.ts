import { BaseState } from './BaseState';
import { Message } from '../../types/Message';
import { ActionId } from '../../types/ActionId';
import { Action } from '../../types/Action';
import { ComponentUrl } from '../../engine/ComponentUrl';

export class StateManager<T extends string> {
	private currentState?: BaseState;

	private readonly stateByName: Record<T, BaseState>;

	constructor(stateByName: Record<T, BaseState>) {
		this.stateByName = stateByName;
	}

	switch(stateName: T) {
		if (this.currentState) {
			this.currentState.exit();
			msg.post(this.currentState.root, 'unload');
		}

		this.currentState = this.stateByName[stateName];
		msg.post(this.currentState.root, 'load');
		msg.post(this.currentState.root, 'enable');
		this.currentState.enter();
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
