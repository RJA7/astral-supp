import { Message } from '../types/Message';
import { Ref } from '../types/Ref';
import { ComponentUrl } from './ComponentUrl';

export function postMessage(receiver: Ref | ComponentUrl, message: Message) {
	msg.post(receiver, message.id, message);
}
