export class SignalBinding<T extends any[] = any[]> {
	public readonly signal: Signal<T>;
	public readonly cb: (...args: T) => void;
	public readonly once: boolean;

	constructor(signal: Signal<T>, cb: (...args: T) => void, once: boolean) {
		this.signal = signal;
		this.cb = cb;
		this.once = once;
	}

	public destroy() {
		this.signal.remove(this);
	}
}

export class Signal<T extends any[] = []> {
	private readonly bindings = new Set<SignalBinding<T>>();

	public add(cb: (...args: T) => void): SignalBinding<T> {
		const binding = new SignalBinding(this, cb, false);
		this.bindings.add(binding);
		return binding;
	}

	public addOnce(cb: (...args: T) => void): SignalBinding<T> {
		const binding = new SignalBinding(this, cb, true);
		this.bindings.add(binding);
		return binding;
	}

	public dispatch(...args: T) {
		for (const binding of this.bindings) {
			binding.cb(...args);

			if (binding.once) {
				this.bindings.delete(binding);
			}
		}
	}

	public remove(binding: SignalBinding<T>) {
		this.bindings.delete(binding);
	}

	public removeAll() {
		this.bindings.clear();
	}
}
