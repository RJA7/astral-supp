import { StateName } from './StateName';
import { BaseState } from './BaseState';
import { CoreState } from './states/CoreState';
import { MenuState } from './states/MenuState';
import { Message } from '../types/Message';
import { MessageId } from '../types/MessageId';

class StateManager {
	private currentState?: BaseState;

	private stateByName!: Record<StateName, BaseState>;

	init() {
		this.stateByName = {
			[StateName.Core]: new CoreState(),
			[StateName.Menu]: new MenuState(),
		};
	}

	switch(stateName: StateName) {
		this.currentState?.exit();
		this.currentState = this.stateByName[stateName];
		this.currentState.enter();
	}

	update(dt: number) {
		this.currentState?.update(dt);
	}

	onMessage<ID extends MessageId>(
		messageId: MessageId,
		message: Message<ID>,
		sender: url,
	) {
		this.currentState?.onMessage(messageId, message, sender);
	}
}

export const stateManager = new StateManager();
