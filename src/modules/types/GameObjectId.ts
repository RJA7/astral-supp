import { patchEnum, toHash } from '../utils/PatchEnum';

export enum GameObjectId {
	player_center = '/player_center',
}

patchEnum(GameObjectId, toHash);
