import { Message } from './Message';
import { ComponentUrl } from '../engine/ComponentUrl';
import { ActionId } from './ActionId';
import { Action } from './Action';
import { GameObject } from '../engine/GameObject';

export type Controller = GameObject & {
	final?(): void;
	update?(dt: number): void;
	lateUpdate?(dt: number): void;
	fixedUpdate?(dt: number): void;
	onMessage?(message: Message, sender: ComponentUrl): void;
	onInput?(actionId: ActionId, action: Action): void;
	onReload?(): void;
};
