type OnlyNumberProps<T> = {
	[K in keyof T as T[K] extends number ? K : never]: T[K];
};

function noop() {}

export class Tweens {
	private readonly timerId: number;

	private readonly tweens: Set<Tween<any, any>>;

	constructor() {
		this.timerId = timer.delay(0, true, this.update.bind(this));
		this.tweens = new Set<Tween<any>>();
	}

	public add<T extends object, P extends keyof T>(
		object: T,
		property: P,
		target: Partial<OnlyNumberProps<T[P]>>,
		duration: number,
	) {
		const tween = new Tween(object, property, target, duration);
		this.tweens.add(tween);

		return tween;
	}

	public destroy() {
		timer.cancel(this.timerId);
	}

	private update(_timerId: number, dt: number) {
		for (const tween of this.tweens) {
			let complete = tween.update(dt);
			tween.object[tween.property] = tween.value;

			if (!complete) {
				tween.updateCallback(tween);
				continue;
			}

			if (tween.yoyoEnabled) {
				tween.yoyoState = !tween.yoyoState;
				tween.repeatsLeft -= tween.yoyoState ? 0 : 1;

				if (tween.repeatsLeft > 0) {
					tween.flip(tween.yoyoState ? tween.yoyoDelay : tween.repeatDelay);
					complete = false;
				}
			} else if (tween.repeatsLeft > 0) {
				tween.repeatsLeft -= 1;
				tween.restart();
				complete = false;
			}

			if (!complete) {
				tween.updateCallback(tween);
				continue;
			}

			tween.completeCallback(tween);
			this.tweens.delete(tween);
		}
	}
}

export class Tween<T extends object, P extends keyof T = keyof T> {
	public readonly object: T;
	public readonly property: P;
	public readonly value: T[P];
	public readonly startValue: T[P];
	public readonly target: Partial<OnlyNumberProps<T[P]>>;
	public readonly targetKeys: (keyof typeof this.target)[];
	public readonly duration: number;
	public time = 0;

	public yoyoEnabled = false;
	public yoyoState = false;
	public yoyoDelay: number = 0;

	public repeatsLeft = 0;
	public repeatDelay = 0;

	public updateCallback: (tween: this) => void = noop;
	public completeCallback: (tween: this) => void = noop;

	constructor(
		object: T,
		property: P,
		target: Partial<OnlyNumberProps<T[P]>>,
		duration: number,
	) {
		this.object = object;
		this.property = property;
		this.value = object[property];
		this.startValue = object[property];
		this.target = target;
		this.duration = duration;
		this.targetKeys = Object.keys(target) as typeof this.targetKeys;
	}

	public onUpdate(updateCallback: (tween: this) => void) {
		this.updateCallback = updateCallback;
		return this;
	}

	public onComplete(completeCallback: (tween: this) => void) {
		this.completeCallback = completeCallback;
		return this;
	}

	public yoyo(delay = 0) {
		this.yoyoEnabled = true;
		this.yoyoDelay = delay;

		return this;
	}

	public repeat(count: number, delay = 0) {
		this.repeatsLeft = count;
		this.repeatDelay = delay;

		return this;
	}

	public delay(time: number) {
		this.time -= time;
		return this;
	}

	public flip(delay: number) {
		for (const key of this.targetKeys) {
			const targetValue = this.target[key];
			this.target[key] = this.startValue[key];
			// @ts-expect-error
			this.startValue[key] = targetValue;
		}

		this.time %= this.duration;
		this.time -= delay;
		this.updateValue();
	}

	public restart() {
		this.time %= this.duration;
		this.time -= this.repeatDelay;
		this.updateValue();
	}

	public update(dt: number): boolean {
		this.time += dt;
		this.updateValue();

		return this.time >= this.duration;
	}

	private updateValue() {
		if (this.time < 0) return;

		const percent = Math.min(1, this.time / this.duration);

		for (const key of this.targetKeys) {
			this.value[key] =
				// @ts-expect-error
				this.startValue[key] +
				// @ts-expect-error
				(this.target[key] - this.startValue[key]) * percent;
		}
	}
}
