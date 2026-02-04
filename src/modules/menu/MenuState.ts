import { BaseState } from '../engine/state_manager/BaseState';
import { Message } from '../types/Message';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { ComponentUrl } from '../engine/ComponentUrl';
import { GameObject } from '../engine/GameObject';

export class MenuState extends GameObject implements BaseState {
	enable(): void {
		super.enable();
	}

	disable(): void {
		super.disable();
	}

	update(_dt: number): void {}

	onMessage(_message: Message, _sender: ComponentUrl) {}

	onInput(_actionId: ActionId, _action: Action): void {}

	resize(): void {}
}
