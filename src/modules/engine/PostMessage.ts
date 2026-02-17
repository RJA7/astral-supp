import { Message, VoidMessageId } from '../types/Message';
import { ComponentUrl } from './ComponentUrl';

export function postMessage(receiver: ComponentUrl, message: Message) {
	msg.post(receiver, message.mid, message);
}

export function postMessageId(
	receiver: ComponentUrl,
	messageId: VoidMessageId,
) {
	msg.post(receiver, messageId);
}
