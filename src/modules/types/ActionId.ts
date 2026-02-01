import { patchEnum, toHash } from '../utils/PatchEnum';

export enum ActionId {
	touch = 'touch',
	mouse_move = 'mouse_move',
}

patchEnum(ActionId, toHash);
