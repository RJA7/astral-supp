import { MessageId } from '../types/MessageId';
import { Message } from '../types/Message';

export type BaseState = {
	enter(): void;
	exit(): void;
	update(dt: number): void;
	onMessage<ID extends MessageId>(
		messageId: MessageId,
		message: Message<ID>,
		sender: url,
	): void;
};
