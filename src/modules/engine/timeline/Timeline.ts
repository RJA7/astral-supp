import { Tweens } from './Tweens';
import { Timers } from './Timers';

export class Timeline {
	private readonly timerId: number;
	public readonly tweens: Tweens;
	public readonly timers: Timers;
	public timeScale = 1;

	public readonly tween: typeof this.tweens.add;
	public readonly wait: typeof this.timers.wait;
	public readonly add: typeof this.timers.add;
	public readonly repeat: typeof this.timers.repeat;
	public readonly loop: typeof this.timers.loop;

	constructor() {
		this.timerId = timer.delay(0, true, this.update.bind(this));

		this.tweens = new Tweens();
		this.timers = new Timers();

		this.tween = this.tweens.add.bind(this.tweens);
		this.wait = this.timers.wait.bind(this.timers);
		this.add = this.timers.add.bind(this.timers);
		this.repeat = this.timers.repeat.bind(this.timers);
		this.loop = this.timers.loop.bind(this.timers);
	}

	public update(_timerId: number, deltaTime: number) {
		const dt = deltaTime * this.timeScale;
		this.tweens.update(dt);
		this.timers.update(dt);
	}

	public destroy() {
		timer.cancel(this.timerId);
	}
}
