import { Script } from '../components/Script';
import { SetControllerMessage } from '../types/Message';
import { ControllerName } from '../../enums/ControllerName';
import { componentUrl } from '../ComponentUrl';
import { Messenger } from '../Messenger';
import { Popup } from './Popup';

export class Popups {
	private readonly messenger: Messenger;

	public popupsId = hash('/popups');

	public popupGuiFragment = hash('gui');

	constructor(messenger: Messenger) {
		this.messenger = messenger;
	}

	public show<C extends ControllerName>(
		popupName: string,
		controllerName: C,
		props: SetControllerMessage<C>['props'],
	): Popup<C> {
		const factoryUrl = componentUrl(this.popupsId, hash(popupName), true);
		const rootId = factory.create(factoryUrl);

		const script = new Script<C>(
			componentUrl(rootId, this.popupGuiFragment, true),
			controllerName as C,
		);
		script.initController(props);
		script.connect(this.messenger);

		return new Popup<C>(rootId, script);
	}

	public hide(popup: Popup<ControllerName>) {
		popup.script.disconnect();
		go.delete(popup.rootId, true);
	}
}
