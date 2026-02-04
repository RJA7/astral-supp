import { patchEnum, toHash } from '../utils/PatchEnum';

export enum ActionId {
	touch = 'touch',
}

patchEnum(ActionId, toHash);
