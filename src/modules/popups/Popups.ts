import { PopupName } from './types/PopupName';
import { PopupsLayout } from '../layouts/PopupsLayout';
import { Script } from '../engine/components/Script';
import { ControllerNameByPopupName } from './types/ControllerNameByPopupName';
import { InitGuiControllerMessage } from '../types/Message';
import { ControllerName } from '../ControllerName';

export class Popups {
	private readonly layout: PopupsLayout;

	constructor(layout: PopupsLayout) {
		this.layout = layout;
	}

	public show<
		T extends PopupName,
		C extends ControllerName = (typeof ControllerNameByPopupName)[T],
	>(popupName: T, props: InitGuiControllerMessage<C>['props']) {
		const factoryUrl = this.layout[popupName].url;
		const rootId = factory.create(factoryUrl);
		go.set_parent(rootId, this.layout.id);

		const controllerName = ControllerNameByPopupName[popupName];
		const script = new Script(
			rootId,
			hash('gui'),
			controllerName,
			props as any,
		);
	}
}
