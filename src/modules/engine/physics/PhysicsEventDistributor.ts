import { GameObjectRegister } from '../GameObjectRegister';
import { PhysicsEvent } from './types';

export class PhysicsEventDistributor {
	private readonly register: GameObjectRegister;

	constructor(register: GameObjectRegister) {
		this.register = register;
	}

	public distributeEvents(events: PhysicsEvent[]) {
		for (const event of events) {
			const a = this.register.objects.get(event.a.id);
			const b = this.register.objects.get(event.b.id);

			if (a?.hasPhysics()) {
				const handler = a.physics.handlers.get(event.b.group);
				handler?.(event);
			}

			if (b?.hasPhysics()) {
				const handler = b.physics.handlers.get(event.a.group);
				handler?.(event);
			}
		}
	}
}
