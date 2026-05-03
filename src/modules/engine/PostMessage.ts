import { Message, VoidMessageId } from './types/Message';
import { ComponentUrl } from './ComponentUrl';
import { GameObjectId } from './types/Hash';

export function postMessage(
	receiver: GameObjectId | ComponentUrl,
	message: Message,
) {
	msg.post(receiver, message.mid, message);
}

export function postVoidMessage(
	receiver: GameObjectId | ComponentUrl,
	messageId: VoidMessageId,
) {
	msg.post(receiver, messageId);
}
