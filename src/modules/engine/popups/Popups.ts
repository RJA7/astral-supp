import { PopupName } from './types/PopupName';
import { Script } from '../components/Script';
import { ControllerNameByPopupName } from './types/ControllerNameByPopupName';
import { SetControllerMessage } from '../../types/Message';
import { ControllerName } from '../../ControllerName';
import { componentUrl } from '../ComponentUrl';
import { Fragment, GameObjectId } from '../types/Hash';
import { Messenger } from '../Messenger';
import { Popup } from './Popup';

const POPUPS_ID: GameObjectId = hash('/popups');
const POPUP_GUI_FRAGMENT: Fragment = hash('gui');

export class Popups {
	private readonly messenger: Messenger;

	constructor(messenger: Messenger) {
		this.messenger = messenger;
	}

	public show<
		T extends PopupName,
		C extends ControllerName = (typeof ControllerNameByPopupName)[T],
	>(popupName: T, props: SetControllerMessage<C>['props']): Popup<C> {
		const factoryUrl = componentUrl(POPUPS_ID, hash(popupName), true);
		const rootId = factory.create(factoryUrl);
		const controllerName = ControllerNameByPopupName[popupName];

		const script = new Script<C>(
			componentUrl(rootId, POPUP_GUI_FRAGMENT, true),
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
