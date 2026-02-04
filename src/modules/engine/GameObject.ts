import { Ref } from '../types/Ref';
import { componentUrl, ComponentUrl } from './ComponentUrl';
import { postMessage } from './PostMessage';
import { MessageId } from '../types/MessageId';

export class GameObject {
	public readonly url: ComponentUrl;

	constructor(ref: Ref) {
		this.url = componentUrl(ref);
	}

	public getPosition() {
		return go.get_position(this.url);
	}

	public setPosition(position: vmath.vector3) {
		go.set_position(position);
	}

	public enable() {
		postMessage(this.url, { id: MessageId.enable });
	}

	public disable() {
		postMessage(this.url, { id: MessageId.disable });
	}

	load(): void {
		postMessage(this.url, { id: MessageId.load });
	}

	unload(): void {
		postMessage(this.url, { id: MessageId.unload });
	}
}
