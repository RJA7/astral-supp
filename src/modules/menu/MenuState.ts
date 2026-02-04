import { BaseState } from '../systems/state_manager/BaseState';
import { Message } from '../types/Message';
import { Ref } from '../types/Ref';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { ComponentUrl, componentUrl } from '../engine/ComponentUrl';

export class MenuState implements BaseState {
	public readonly root = componentUrl(Ref.MenuProxy);

	enter(): void {}

	exit(): void {}

	update(_dt: number): void {}

	onMessage(_message: Message, _sender: ComponentUrl) {}

	onInput(_actionId: ActionId, _action: Action): void {}

	resize(): void {}
}
