import { PopupName } from './PopupName';
import { ControllerName } from '../../../ControllerName';

export const ControllerNameByPopupName = {
	[PopupName.restart]: ControllerName.RestartPopupController,
} satisfies Record<PopupName, ControllerName>;
