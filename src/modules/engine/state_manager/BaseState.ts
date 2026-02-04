import { Message } from '../../types/Message';
import { ActionId } from '../../types/ActionId';
import { Action } from '../../types/Action';
import { GameObject } from '../GameObject';

export type BaseState = GameObject & {
	update(dt: number): void;
	onMessage(message: Message, sender: url): void;
	onInput(actionId: ActionId, action: Action): void;
	resize(): void;
};
