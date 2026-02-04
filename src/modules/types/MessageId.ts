import { patchEnum, toHash } from '../utils/PatchEnum';

export enum MessageId {
	LoadState = 'LoadState',
	Resize = 'Resize',

	// engine
	enable = 'enable',
	disable = 'disable',
	load = 'load',
	unload = 'unload',
	proxy_loaded = 'proxy_loaded',
	acquire_input_focus = 'acquire_input_focus',
}

patchEnum(MessageId, toHash);
