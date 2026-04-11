import { Signal } from '../engine/Signal';

export class CoreState {
	onLevelChanged = new Signal();

	onPlayerHpChanged = new Signal();

	onFinished = new Signal();

	levelNumber = 1;

	playerHp = 100;

	gameOver = false;

	setLevel(value: number) {
		this.gameOver = false;
		this.levelNumber = value;
		this.onLevelChanged.dispatch();
	}

	setHp(value: number) {
		this.playerHp = Math.max(0, value);

		if (this.playerHp === 0) {
			this.gameOver = true;
		}

		this.onPlayerHpChanged.dispatch();
	}

	finish() {
		this.gameOver = true;
		this.onFinished.dispatch();
	}
}
