import { componentUrl, ComponentUrl } from '../ComponentUrl';
import { Component } from './Component';
import { Fragment, GameObjectId } from '../types/Hash';
import { MessageId } from '../../types/MessageId';
import { postMessage } from '../PostMessage';
import { ScriptBridge } from '../ScriptBridge';
import { ControllerName } from '../../ControllerName';
import { InitGuiControllerMessage } from '../../types/Message';

export class Script<T extends ControllerName> implements Component {
	public readonly url: ComponentUrl;

	private readonly bridge: ScriptBridge<T>;

	public readonly call: ScriptBridge<T>['call'];

	constructor(
		id: GameObjectId,
		fragment: Fragment,
		controllerName: T,
		props: InitGuiControllerMessage<T>['props'],
	) {
		this.url = componentUrl(id, fragment, true);
		this.bridge = new ScriptBridge(this.url);
		this.call = this.bridge.call.bind(this.bridge);

		postMessage(this.url, {
			mid: MessageId.SetController,
			controllerName,
			props,
		});
	}
}
