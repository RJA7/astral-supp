import { MessageId } from './MessageId';
import { Ref } from './Ref';
import { RenderMessage } from '../../scripts/render.render_script';

export type Message =
	| {
			mid: VoidMessageId;
	  }
	| {
			mid: MessageId.LoadProxy;
			proxyRef: Ref;
	  }
	| AnimationDoneMessage
	| {
			mid: MessageId.trigger_response;
			other_id: hash;
			enter: boolean;
			group: hash;
			other_group: hash;
			own_group: hash;
	  }
	| RenderMessage;

export type VoidMessageId =
	| MessageId.PlayerEnteredSafeZone
	| MessageId.PlayerLeftSafeZone
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

export type AnimationDoneMessage = {
	mid: MessageId.animation_done;
	id: hash; // id of the animation that was completed
	current_tile: number; // the current tile of the sprite
};
