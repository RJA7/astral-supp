import { patchEnum, toHash } from '../utils/PatchEnum';

export enum MessageId {
	LoadProxy = 'LoadProxy',

	// engine
	enable = 'enable',
	disable = 'disable',
	async_load = 'async_load',
	load = 'load',
	unload = 'unload',
	proxy_loaded = 'proxy_loaded',
	acquire_input_focus = 'acquire_input_focus',
	release_input_focus = 'release_input_focus',
}

patchEnum(MessageId, toHash);
