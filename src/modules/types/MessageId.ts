import { patchEnum, toHash } from '../utils/PatchEnum';

export enum MessageId {
	LoadProxy = 'LoadProxy',
	PlayerLeftSafeZone = 'PlayerLeftSafeZone',
	PlayerEnteredSafeZone = 'PlayerEnteredSafeZone',

	// render
	ClearColor = 'ClearColor',
	SetViewProjection = 'SetViewProjection',
	SetCameraProjection = 'SetCameraProjection',
	UseStretchProjection = 'UseStretchProjection',
	UseFixedProjection = 'UseFixedProjection',
	UseFixedFitProjection = 'UseFixedFitProjection',

	// engine
	enable = 'enable',
	disable = 'disable',
	async_load = 'async_load',
	load = 'load',
	unload = 'unload',
	proxy_loaded = 'proxy_loaded',
	acquire_input_focus = 'acquire_input_focus',
	release_input_focus = 'release_input_focus',
	animation_done = 'animation_done',
	trigger_response = 'trigger_response',
	window_resized = 'window_resized',
}

patchEnum(MessageId, toHash);
