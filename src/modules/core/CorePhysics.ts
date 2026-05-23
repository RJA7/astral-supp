import { GameObjectId } from '../engine';
import { PhysicsGroup } from '../enums/PhysicsGroup';
import { CoreState } from './CoreState';
import { LevelLayout } from '../layouts/LevelLayout';

export class CorePhysics {
	private readonly state: CoreState;

	private isSafeById = new Map<GameObjectId, number>();

	private playerCenterId!: GameObjectId;

	constructor(state: CoreState) {
		this.state = state;
	}

	public setLayout(layout: LevelLayout): void {
		[layout.player_center, ...layout.player_edges].forEach((playerTrigger) => {
			[PhysicsGroup.safe_zone, PhysicsGroup.finish_zone].forEach((group) => {
				playerTrigger.physics.setHandler(group, (event) => {
					if (this.state.gameOver) return;

					const current = this.isSafeById.get(playerTrigger.id) ?? 0;

					if (event.enter) {
						this.isSafeById.set(playerTrigger.id, current + 1);
					} else {
						this.isSafeById.set(playerTrigger.id, Math.max(0, current - 1));
					}
				});
			});
		});

		layout.player.physics.setHandler(PhysicsGroup.finish_zone, () => {
			if (this.state.gameOver) return;
			this.state.finish();
		});

		layout.player.physics.setHandler(PhysicsGroup.bullet, () => {
			if (this.state.gameOver) return;
			this.state.setHp(0);
		});

		this.playerCenterId = layout.player_center.id;
	}

	public onLevelChanged() {
		this.isSafeById.clear();
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
