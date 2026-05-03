import { ControllerClass } from './engine';
import { MainController } from './MainController';
import { CoreController } from './core/CoreController';
import { CoreGuiController } from './core/CoreGuiController';
import { ControllerName } from './enums/ControllerName';
import { RestartPopupController } from './popups/RestartPopupController';

export const Controllers = {
	[ControllerName.MainController]: MainController,
	[ControllerName.CoreController]: CoreController,
	[ControllerName.CoreGuiController]: CoreGuiController,
	[ControllerName.RestartPopupController]: RestartPopupController,
} satisfies Record<ControllerName, ControllerClass>;
