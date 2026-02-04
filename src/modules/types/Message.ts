import { MessageId } from './MessageId';
import { StateName } from './StateName';

export type Message =
	| {
			id:
				| MessageId.enable
				| MessageId.disable
				| MessageId.load
				| MessageId.unload
				| MessageId.proxy_loaded;
	  }
	| {
			id: MessageId.LoadState;
			stateName: StateName;
	  };
