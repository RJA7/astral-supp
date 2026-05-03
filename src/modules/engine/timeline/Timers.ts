export class Timers {
	private readonly timers = new Set<Timer>();

	public wait(period: number): Promise<void> {
		return new Promise((callback) => {
			this.create(period, 1, callback);
		});
	}

	public add(period: number, callback: () => void): Timer {
		return this.create(period, 1, callback);
	}

	public loop(period: number, callback: () => void): Timer {
		return this.create(period, Infinity, callback);
	}

	public repeat(period: number, calls: number, callback: () => void): Timer {
		return this.create(period, calls, callback);
	}

	private create(period: number, calls: number, callback: () => void): Timer {
		const timer = new Timer(this, period, calls, callback);
		this.timers.add(timer);

		return timer;
	}

	public cancel(timer: Timer) {
		this.timers.delete(timer);
	}

	public update(dt: number): void {
		for (const timer of this.timers) {
			timer.time -= dt;

			if (timer.time > 0) continue;

			timer.callback();
			timer.callsLeft -= 1;

			if (timer.callsLeft <= 0) {
				this.timers.delete(timer);
			} else {
				timer.time += timer.period;
			}
		}
	}
}

export class Timer {
	public readonly timers: Timers;
	public period: number;
	public time: number;
	public callsLeft: number;
	public readonly callback: () => void;

	constructor(
		timers: Timers,
		period: number,
		callsLeft: number,
		callback: () => void,
	) {
		this.timers = timers;
		this.period = period;
		this.time = period;
		this.callsLeft = callsLeft;
		this.callback = callback;
	}

	public destroy() {
		this.timers.cancel(this);
	}
}
