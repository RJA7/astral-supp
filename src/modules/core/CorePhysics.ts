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
	}

	public onLevelChanged() {
		this.isSafeById.clear();
	}

	public handleEvents(events: PhysicsEvent[]) {
		for (const event of events) {
			this.handleEvent(event);
		}
	}

	private handleEvent(event: PhysicsEvent) {
		if (this.state.gameOver) return;

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
			event.b.group === PhysicsGroup.finish_zone
		) {
			this.state.finish();
		}

		if (
			event.type === PhysicsEventType.trigger_event &&
			event.a.group === PhysicsGroup.player &&
			event.b.group === PhysicsGroup.bullet
		) {
			this.state.setHp(0);
		}
	}

	private dispatchSignals() {
		if (this.state.gameOver) return;

		if (this.isSafeById.get(this.playerCenterId) === 0) {
			this.state.setHp(0);
			return;
		}

		let hp = this.state.playerHp;
		let changed = false;

		for (const [id] of this.isSafeById) {
			if (this.isSafeById.get(id) !== 0) continue;

			hp = Math.max(0, hp - 1);
			changed = true;
		}

		if (changed) {
			this.state.setHp(hp);
		}
	}

	public fixedUpdate() {
		if (this.state.gameOver) return;
		this.dispatchSignals();
	}
}
