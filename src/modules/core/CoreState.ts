import { Signal } from '../engine/Signal';
import { GameObjectId } from '../engine/types/Hash';
import { LevelPart } from './types/LevelData';

export class CoreState {
	onLevelPartChanged = new Signal();

	onPlayerPortalCollision = new Signal<[GameObjectId]>();

	onPlayerHpChanged = new Signal();

	levelNumber = 1;

	levelPart = LevelPart.LT;

	playerHp = 100;

	setLevelPart(value: LevelPart) {
		this.levelPart = value;
		this.onLevelPartChanged.dispatch();
	}

	setHp(value: number) {
		this.playerHp = value;
		this.onPlayerHpChanged.dispatch();
	}
}
