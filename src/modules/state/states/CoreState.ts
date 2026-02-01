import { BaseState } from '../BaseState';
import { MessageId } from '../../types/MessageId';
import { Message } from '../../types/Message';

const CORE_PROXY = '/state_loader#core_proxy';

export class CoreState implements BaseState {
	enter(): void {
		// TODO
		msg.post(CORE_PROXY, 'load');
		msg.post(CORE_PROXY, 'enable');
	}

	exit(): void {
		msg.post(CORE_PROXY, 'unload');
	}

	update(_dt: number): void {}

	onMessage<ID extends MessageId>(
		_messageId: MessageId,
		_message: Message<ID>,
		_sender: url,
	) {}
}
