import { MessageId } from './MessageId';
import { ControllerName } from '../ControllerName';
import { Controllers } from '../Controllers';

export type Message =
	| VoidMessage
	| AnimationDoneMessage
	| ClearColorMessage
	| ContactPointResponseMessage
	| TriggerResponseMessage
	| InitGuiControllerMessage
	| ScriptBridgeCallMessage;

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

export type InitGuiControllerMessage<
	T extends ControllerName = ControllerName,
> = {
	mid: MessageId.SetController;
	controllerName: T;
	props: ConstructorParameters<(typeof Controllers)[T]>[0];
};

export type ScriptBridgeCallMessage = {
	mid: MessageId.ScriptBridgeCall;
	methodName: string;
	args: any[];
};
