import { Message } from '../types/Message';
import { Ref } from '../types/Ref';
import { ComponentUrl } from './ComponentUrl';
import { MessageId } from '../types/MessageId';

export function postMessage(receiver: Ref | ComponentUrl, message: Message) {
	msg.post(receiver, message.mid, message);
}

export function postMessageId(
	receiver: Ref | ComponentUrl,
	messageId: MessageId,
) {
	msg.post(receiver, messageId);
}
