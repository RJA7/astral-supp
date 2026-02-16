import { MessageId } from './MessageId';
import { Ref } from './Ref';

export type Message =
	| VoidMessage
	| LoadProxyMessage
	| AnimationDoneMessage
	| ClearColorMessage
	| ContactPointResponseMessage
	| TriggerResponseMessage;

export type VoidMessageId =
	| MessageId.enable
	| MessageId.disable
	| MessageId.async_load
	| MessageId.load
	| MessageId.unload
	| MessageId.proxy_loaded
	| MessageId.acquire_input_focus
	| MessageId.release_input_focus
	| MessageId.animation_done
	| MessageId.window_resized;

export type VoidMessage<T extends VoidMessageId = VoidMessageId> = {
	mid: T;
};

export type LoadProxyMessage = {
	mid: MessageId.LoadProxy;
	proxyRef: Ref;
};

export type ClearColorMessage = {
	mid: MessageId.ClearColor;
	color: vmath.vector4;
};

export type AnimationDoneMessage = {
	mid: MessageId.animation_done;
	id: hash; // id of the animation that was completed
	current_tile: number; // the current tile of the sprite
};

export type ContactPointResponseMessage = {
	mid: MessageId.contact_point_response;
	position: vmath.vector3;
	distance: number;
	applied_impulse: number;
	life_time: number;
	mass: number;
	other_id: hash;
	own_group: hash;
	group: hash;
	other_position: vmath.vector3;
	other_group: hash;
	other_mass: number;
	relative_velocity: vmath.vector3;
	normal: vmath.vector3;
};

export type TriggerResponseMessage = {
	mid: MessageId.trigger_response;
	other_id: hash;
	enter: boolean;
	group: hash;
	other_group: hash;
	own_group: hash;
};
