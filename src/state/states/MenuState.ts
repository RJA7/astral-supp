import { BaseState } from '../BaseState';
import { MessageId } from '../../types/MessageId';
import { Message } from '../../types/Message';

export class MenuState implements BaseState {
	enter(): void {}

	exit(): void {}

	update(_dt: number): void {}

	onMessage<ID extends MessageId>(
		_messageId: MessageId,
		_message: Message<ID>,
		_sender: url,
	) {}
}
