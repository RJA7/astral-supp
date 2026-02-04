import { BaseState } from '../engine/state_manager/BaseState';
import { Message } from '../types/Message';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { ComponentUrl } from '../engine/ComponentUrl';
import { CoreController } from './controllers/CoreController';
import { GameObject } from '../engine/GameObject';

export class CoreState extends GameObject implements BaseState {
	private controller: CoreController | undefined;

	enable(): void {
		super.enable();

		this.controller = new CoreController();
		this.controller.start();
	}

	disable(): void {
		super.disable();
	}

	update(_dt: number): void {}

	onMessage(_message: Message, _sender: ComponentUrl) {}

	onInput(actionId: ActionId, action: Action): void {
		this.controller?.onInput(actionId, action);
	}

	resize(): void {}
}
