import { Message } from '../types/Message';
import { MessageId } from '../types/MessageId';
import { Ref } from '../types/Url';

export function postMessage<ID extends MessageId>(
	receiver: Ref | url,
	messageId: ID,
	message: Message<ID>,
) {
	const receiverUrl =
		typeof receiver === 'string' ? msg.url(receiver) : receiver;
	msg.post(receiverUrl, messageId, message);
}

export function messageUrl(ref: Ref) {
	return msg.url(ref);
}
