import { input } from '../systems/Input';
import { MessageId } from '../types/MessageId';
import { Message } from '../types/Message';
import { ActionId } from '../types/ActionId';
import { Ref } from '../types/Url';
import { messageUrl } from '../systems/Message';

type Self = {
	dragging: boolean;
};

export function init(this: Self) {
	this.dragging = false;
	input.register(messageUrl(Ref.CurrentComponent));
	go.set_scale_xy(0.6);
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

	if (actionId === ActionId.mouse_button_1 || actionId === ActionId.touch) {
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
