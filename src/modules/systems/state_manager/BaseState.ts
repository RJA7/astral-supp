import { Message } from '../../types/Message';
import { ActionId } from '../../types/ActionId';
import { Action } from '../../types/Action';
import { ComponentUrl } from '../../engine/ComponentUrl';

export type BaseState = {
	root: ComponentUrl;
	enter(): void;
	exit(): void;
	update(dt: number): void;
	onMessage(message: Message, sender: url): void;
	onInput(actionId: ActionId, action: Action): void;
	resize(): void;
};
