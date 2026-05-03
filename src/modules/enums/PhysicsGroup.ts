import { patchEnum, toHash } from '../engine';

export enum PhysicsGroup {
	player = 'player',
	player_trigger = 'player_trigger',
	safe_zone = 'safe_zone',
	finish_zone = 'finish_zone',
	bullet = 'bullet',
	wall = 'wall',
}
patchEnum(PhysicsGroup, toHash);
