import { postVoidMessage } from '../PostMessage';
import { MessageId } from '../types/MessageId';
import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { Fragment, GameObjectId } from '../types/Hash';
import { Component } from './Component';
import { Script } from './Script';
import { ControllerName } from '../../enums/ControllerName';

const COLLECTION_ROOT_ID: GameObjectId = hash('/root');
const COLLECTION_SCRIPT_FRAGMENT: Fragment = hash('controller');

export class CollectionProxy<T extends ControllerName> implements Component {
	public readonly url: ComponentUrl;
	public script: Script<T>;

	constructor(
		id: GameObjectId,
		fragment: Fragment,
		collectionName: string,
		controllerName: T,
	) {
		this.url = componentUrl(id, fragment, true);

		this.script = new Script(
			msg.url(
				collectionName,
				COLLECTION_ROOT_ID,
				COLLECTION_SCRIPT_FRAGMENT,
			) as ComponentUrl,
			controllerName,
		);
	}

	enable() {
		postVoidMessage(this.url, MessageId.enable);
	}

	disable() {
		postVoidMessage(this.url, MessageId.disable);
	}

	asyncLoad(): void {
		postVoidMessage(this.url, MessageId.async_load);
	}

	load(): void {
		postVoidMessage(this.url, MessageId.load);
	}

	unload(): void {
		postVoidMessage(this.url, MessageId.unload);
	}
}
