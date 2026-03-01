import { Tween, UnknownProps } from './Tween';

export default class Tweener {
	private _tweens: Record<string, Tween> = {};
	private _tweensAddedDuringUpdate: Record<string, Tween> = {};
	private _time = 0;

	getAll(): Array<Tween> {
		return Object.keys(this._tweens).map((tweenId) => this._tweens[tweenId]);
	}

	removeAll(): void {
		this._tweens = {};
	}

	add<T extends UnknownProps>(object: T): Tween<T> {
		const tween = new Tween(object, this);
		this._tweens[tween.getId()] = tween;
		this._tweensAddedDuringUpdate[tween.getId()] = tween;

		return tween;
	}

	remove(...tweens: Tween[]): void {
		for (const tween of tweens) {
			// @ts-expect-error library internal access
			tween._group = undefined;

			delete this._tweens[tween.getId()];
			delete this._tweensAddedDuringUpdate[tween.getId()];
		}
	}

	/** Return true if all tweens in the group are not paused or playing. */
	allStopped() {
		return this.getAll().every((tween) => !tween.isPlaying());
	}

	update(dt: number, preserve = true): void {
		this._time += dt * 1000;

		const time = this._time;
		let tweenIds = Object.keys(this._tweens);

		if (tweenIds.length === 0) return;

		// Tweens are updated in "batches". If you add a new tween during an
		// update, then the new tween will be updated in the next batch.
		// If you remove a tween during an update, it may or may not be updated.
		// However, if the removed tween was added during the current batch,
		// then it will not be updated.
		while (tweenIds.length > 0) {
			this._tweensAddedDuringUpdate = {};

			for (let i = 0; i < tweenIds.length; i++) {
				const tween = this._tweens[tweenIds[i]];
				const autoStart = !preserve;

				if (tween && tween.update(time, autoStart) === false && !preserve)
					this.remove(tween);
			}

			tweenIds = Object.keys(this._tweensAddedDuringUpdate);
		}
	}

	onComplete(callback: (object: Tween[]) => void) {
		const group = this.getAll();
		group.forEach((tween) => {
			const prevCallback = tween.getCompleteCallback();
			tween.onComplete(() => {
				prevCallback?.(tween);
				// After the onComplete callback completes, _isPlaying is updated to false, so if the total number of completed tweens is -1, then they are all complete.
				const completedGroup = group.filter((tween) => !tween.isPlaying());
				if (completedGroup.length === group.length - 1) callback(group);
			});
		});
	}

	getTime() {
		return this._time;
	}
}
