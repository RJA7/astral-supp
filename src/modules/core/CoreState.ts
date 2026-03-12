import { Signal } from '../engine/Signal';
import { GameObjectId } from '../engine/types/Hash';
import { LevelPart } from './types/LevelData';

export class CoreState {
	onPlayerPortalCollision = new Signal<[GameObjectId]>();

	onPlayerPickupCollision = new Signal<[GameObjectId]>();

	onLevelPartChanged = new Signal();

	onLevelSpeedChanged = new Signal();

	onPlayerHpChanged = new Signal();

	levelNumber = 1;

	levelSpeed = 1;

	levelPart = LevelPart.RB;

	playerHp = 100;

	setLevelPart(value: LevelPart) {
		this.levelPart = value;
		this.onLevelPartChanged.dispatch();
	}

	setHp(value: number) {
		this.playerHp = value;
		this.onPlayerHpChanged.dispatch();
	}

	setLevelSpeed(value: number) {
		this.levelSpeed = value;
		this.onLevelSpeedChanged.dispatch();
	}
}
