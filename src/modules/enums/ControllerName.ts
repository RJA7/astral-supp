import { patchEnum, toHash } from '../engine';

export enum ControllerName {
	MainController = 'MainController',
	CoreController = 'CoreController',
	CoreGuiController = 'CoreGuiController',
	RestartPopupController = 'RestartPopupController',
}

patchEnum(ControllerName, toHash);
