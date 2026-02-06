import { MessageId } from './MessageId';
import { Ref } from './Ref';

export type Message =
	| {
			mid: MessageId.LoadProxy;
			proxyRef: Ref;
	  }
	| AnimationDoneMessage
	| {
			mid:
				| MessageId.proxy_loaded
				| MessageId.PlayerEnteredSafeZone
				| MessageId.PlayerLeftSafeZone;
	  }
	| {
			mid: MessageId.trigger_response;
			other_id: hash;
			enter: boolean;
			group: hash;
			other_group: hash;
			own_group: hash;
	  }
	| {
			mid: MessageId.use_fixed_fit_projection;
			near: number;
			far: number;
			zoom?: number;
	  };

export type AnimationDoneMessage = {
	mid: MessageId.animation_done;
	id: hash; // id of the animation that was completed
	current_tile: number; // the current tile of the sprite
};
