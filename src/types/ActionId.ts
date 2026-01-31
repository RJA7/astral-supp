import { patchEnum, toHash } from '../utils/PatchEnum';

export enum ActionId {
	touch = 'touch',
	mouse_button_1 = 'mouse_button_1',
	mouse_move = 'mouse_move',
}

patchEnum(ActionId, toHash);
