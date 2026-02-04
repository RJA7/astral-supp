import { Ref } from '../types/Ref';
import { componentUrl, ComponentUrl } from './ComponentUrl';
import { postMessageId } from './PostMessage';
import { MessageId } from '../types/MessageId';

export class GameObject {
	public readonly url: ComponentUrl;

	constructor(ref: Ref) {
		this.url = componentUrl(ref);
	}

	getPosition() {
		return go.get_position(this.url);
	}

	setPosition(position: vmath.vector3) {
		go.set_position(position, this.url);
	}

	enable() {
		postMessageId(this.url, MessageId.enable);
	}

	disable() {
		postMessageId(this.url, MessageId.disable);
	}

	asyncLoad(): void {
		postMessageId(this.url, MessageId.async_load);
	}

	load(): void {
		postMessageId(this.url, MessageId.load);
	}

	unload(): void {
		postMessageId(this.url, MessageId.unload);
	}

	acquireInputFocus(): void {
		postMessageId(this.url, MessageId.acquire_input_focus);
	}

	release_input_focus(): void {
		postMessageId(this.url, MessageId.release_input_focus);
	}
}
