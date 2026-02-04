import { MessageId } from './MessageId';
import { Ref } from './Ref';

export type Message = {
	id: MessageId.LoadProxy;
	proxyRef: Ref;
};
