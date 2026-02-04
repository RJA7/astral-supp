import { Ref } from '../types/Ref';
import { componentUrl, ComponentUrl } from './ComponentUrl';
import { postMessage } from './PostMessage';
import { MessageId } from '../types/MessageId';
import { Message } from '../types/Message';

export class GameObject {
	public readonly url: ComponentUrl;

	constructor(ref: Ref) {
		this.url = componentUrl(ref);
	}

	getPosition() {
		return go.get_position(this.url);
	}

	setPosition(position: vmath.vector3) {
		go.set_position(position);
	}

	enable() {
		this.postMessage({ id: MessageId.enable });
	}

	disable() {
		this.postMessage({ id: MessageId.disable });
	}

	load(): void {
		this.postMessage({ id: MessageId.load });
	}

	unload(): void {
		this.postMessage({ id: MessageId.unload });
	}

	postMessage(message: Message) {
		postMessage(this.url, message);
	}
}
