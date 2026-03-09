import { MainController } from './MainController';
import { CoreController } from './core/CoreController';
import { ControllerClass } from './types/Controller';
import { CoreGuiController } from './core/CoreGuiController';
import { ControllerName } from './ControllerName';

export const Controllers = {
	[ControllerName.MainController]: MainController,
	[ControllerName.CoreController]: CoreController,
	[ControllerName.CoreGuiController]: CoreGuiController,
} satisfies Record<ControllerName, ControllerClass>;
