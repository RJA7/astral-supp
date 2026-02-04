import { MessageId } from './MessageId';
import { StateName } from './StateName';

export type Message =
	| {
			id:
				| MessageId.enable
				| MessageId.disable
				| MessageId.load
				| MessageId.unload
				| MessageId.proxy_loaded
				| MessageId.acquire_input_focus
				| MessageId.Resize;
	  }
	| {
			id: MessageId.LoadState;
			stateName: StateName;
	  };
