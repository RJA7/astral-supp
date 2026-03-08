import { PhysicsEvent, PhysicsEventType, PhysicsGroup } from '../types/Physics';
import { GameObjectId } from '../engine/types/Hash';
import { CoreState } from './CoreState';

export class CorePhysics {
	private readonly state: CoreState;

	private isSafeById = new Map<GameObjectId, number>();

	private readonly playerCenterId: GameObjectId;

	constructor(state: CoreState, playerCenterId: GameObjectId) {
		this.state = state;
		this.playerCenterId = playerCenterId;

		this.state.onLevelPartChanged.add(() => {
			this.isSafeById.clear();
		});
	}

	public handleEvents(events: PhysicsEvent[]) {
		for (const event of events) {
			this.handleEvent(event);
		}

		this.logResult();
	}

	private handleEvent(event: PhysicsEvent) {
		if (event.a.group < event.b.group) {
			[event.a, event.b] = [event.b, event.a];
		}

		if (
			event.type === PhysicsEventType.trigger_event &&
			event.a.group === PhysicsGroup.player &&
			event.b.group === PhysicsGroup.safe_zone
		) {
			const current = this.isSafeById.get(event.a.id) ?? 0;

			if (event.enter) {
				this.isSafeById.set(event.a.id, current + 1);
			} else {
				this.isSafeById.set(event.a.id, Math.max(0, current - 1));
			}
		}

		if (
			event.type === PhysicsEventType.trigger_event &&
			event.a.group === PhysicsGroup.player &&
			event.b.group === PhysicsGroup.portal
		) {
			this.state.onPlayerPortalCollision.dispatch(event.b.id);
			print(event.b.id);
		}
	}

	private logResult() {
		if (this.isSafeById.get(this.playerCenterId) === 0) {
			print('KILL');
			return;
		}

		for (const [id] of this.isSafeById) {
			if (this.isSafeById.get(id) !== 0) continue;
			print('HIT', id);
		}
	}
}
