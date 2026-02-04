import { Message } from '../modules/types/Message';
import { MessageId } from '../modules/types/MessageId';
import { ComponentUrl } from '../modules/engine/ComponentUrl';
import { App } from '../modules/App';

type Self = {
	app: App;
};

export function init(this: Self) {
	this.app = new App();
}

export function on_message(
	this: Self,
	messageId: MessageId,
	message: Message,
	sender: ComponentUrl,
) {
	message.id = messageId; // for engine messages
	this.app.onMessage(message, sender);
}
