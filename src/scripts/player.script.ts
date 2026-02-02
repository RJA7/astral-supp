import { input } from '../modules/systems/Input';
import { MessageId } from '../modules/types/MessageId';
import { Message } from '../modules/types/Message';
import { ActionId } from '../modules/types/ActionId';
import { Ref } from '../modules/types/Url';
import { messageUrl } from '../modules/systems/Message';

type Self = {
	dragging: boolean;
};

export function init(this: Self) {
	this.dragging = false;
	input.register(messageUrl(Ref.CurrentComponent));
}

export function final(this: Self) {
	input.unregister(messageUrl(Ref.CurrentComponent));
}

export function on_message<ID extends MessageId>(
	this: Self,
	messageId: ID,
	message: Message<ID>,
	_sender: url,
) {
	if (messageId !== MessageId.Input) return;

	const { actionId, action } = message;

	if (actionId === ActionId.touch) {
		if (action.pressed) {
			this.dragging = true;
		}

		if (action.released) {
			this.dragging = false;
		}
	}

	if (this.dragging) {
		const newPos = camera.screen_xy_to_world(action.screen_x, action.screen_y);
		newPos.z = go.get_position().z;
		go.set_position(newPos);
	}
}
