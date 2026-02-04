import { MessageId } from './MessageId';
import { StateName } from './StateName';

export type Message = {
	id: MessageId.SwitchState;
	stateName: StateName;
};
