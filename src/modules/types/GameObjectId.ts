import { patchEnum, toHash } from '../utils/PatchEnum';

export enum GameObjectId {
	player = '/player',
	cursor = '/cursor',
	player_center = '/player_center',
	safe_zones = '/safe_zones',
	finish_zone = '/finish_zone',
}

patchEnum(GameObjectId, toHash);
