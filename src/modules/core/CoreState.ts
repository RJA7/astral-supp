import { Signal } from '../engine/Signal';

export class CoreState {
	onPlayerHpChanged = new Signal();

	onFinished = new Signal();

	playerHp = 100;

	gameOver = false;

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
