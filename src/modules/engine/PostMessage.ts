import { Message, VoidMessageId } from '../types/Message';
import { Ref } from '../types/Ref';
import { ComponentUrl } from './ComponentUrl';

export function postMessage(receiver: Ref | ComponentUrl, message: Message) {
	msg.post(receiver, message.mid, message);
}

export function postMessageId(
	receiver: Ref | ComponentUrl,
	messageId: VoidMessageId,
) {
	msg.post(receiver, messageId);
}
