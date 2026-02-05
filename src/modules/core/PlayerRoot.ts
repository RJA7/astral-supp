import { Controller } from '../types/Controller';
import { GameObject } from '../engine/GameObject';
import { Message } from '../types/Message';
import { ComponentUrl } from '../engine/ComponentUrl';
import { MessageId } from '../types/MessageId';
import { postMessageId } from '../engine/PostMessage';
import { Ref } from '../types/Ref';

const SAFE_ZONE_GROUP = hash('safe_zone');
const BODIES_COUNT = 4;

export class PlayerRoot extends GameObject implements Controller {
	private bodiesInSafeZone = BODIES_COUNT;

	onMessage(message: Message, _sender: ComponentUrl): void {
		if (
			message.mid === MessageId.trigger_response &&
			message.other_group === SAFE_ZONE_GROUP
		) {
			const delta = message.enter ? 1 : -1;
			this.bodiesInSafeZone = vmath.clamp(
				this.bodiesInSafeZone + delta,
				0,
				BODIES_COUNT,
			);

			const mid =
				this.bodiesInSafeZone < BODIES_COUNT
					? MessageId.PlayerLeftSafeZone
					: MessageId.PlayerEnteredSafeZone;

			postMessageId(Ref.CoreRootGO, mid);
		}
	}
}
