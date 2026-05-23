import { patchEnum, toHash } from '../utils/PatchEnum';

export enum ActionId {
	touch = 'touch',
	middle_click = 'middle_click',
}

patchEnum(ActionId, toHash);
