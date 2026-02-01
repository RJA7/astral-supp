import { Action } from './Action';
import { ActionId } from './ActionId';
import { MessageId } from './MessageId';

export type Message<ID extends MessageId> = {
	[MessageId.Input]: {
		actionId: ActionId;
		action: Action;
	};
}[ID];
