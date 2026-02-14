import { Controller } from '../types/Controller';
import { GameObject } from '../engine/GameObject';
import { ContactPointResponseMessage, Message } from '../types/Message';
import { ComponentUrl } from '../engine/ComponentUrl';
import { MessageId } from '../types/MessageId';

const SAFE_ZONE_GROUP = hash('safe_zone');

export class PlayerRoot extends GameObject implements Controller {
	public initialized = false;

	private currentContact: ContactPointResponseMessage | undefined;

	private readonly minOverlap = 20;

	public contacts: ContactPointResponseMessage[] = [];

	onMessage(message: Message, _sender: ComponentUrl): void {
		if (
			message.mid === MessageId.contact_point_response &&
			message.other_group === SAFE_ZONE_GROUP
		) {
			this.initialized = true;
			this.contacts.push(message);
		}
	}

	public update() {
		if (!this.initialized) return;

		const contact = this.getMaxOverlapContact();
		this.contacts = [];

		if (!contact) {
			print('kill');
			return;
		}

		const prevContact = this.currentContact || contact;
		this.currentContact = contact;

		if (contact.other_id !== prevContact.other_id) {
			print(contact.other_id, contact.distance, prevContact.distance);
		}

		if (contact.distance < this.minOverlap) {
			print('kill by min overlap', contact.distance);
			return;
		}

		if (
			contact.other_id !== prevContact.other_id &&
			contact.distance + prevContact.distance > this.minOverlap * 2
		) {
			print('kill because switched to another safe zone via gap');
			// return;
		}
	}

	private getMaxOverlapContact() {
		let contact: ContactPointResponseMessage | undefined;
		let distance = -Infinity;

		for (const c of this.contacts) {
			if (c.distance < distance) continue;

			contact = c;
			distance = c.distance;
		}

		return contact;
	}
}
