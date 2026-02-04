import { patchEnum, toHash } from '../utils/PatchEnum';

export enum MessageId {
	LoadState = 'LoadState',

	// engine
	enable = 'enable',
	disable = 'disable',
	load = 'load',
	unload = 'unload',
	proxy_loaded = 'proxy_loaded',
}

patchEnum(MessageId, toHash);
