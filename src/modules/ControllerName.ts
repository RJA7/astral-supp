import { patchEnum, toHash } from './utils/PatchEnum';

export enum ControllerName {
	MainController = 'MainController',
	CoreController = 'CoreController',
	CoreGuiController = 'CoreGuiController',
}

patchEnum(ControllerName, toHash);
