import { Message } from '../types/Message';

export class SignalBinding<T = void> {
	public readonly signal: Signal<T>;
	public readonly cb: (value: T) => void;
	public readonly once: boolean;

	constructor(signal: Signal<T>, cb: (value: T) => void, once: boolean) {
		this.signal = signal;
		this.cb = cb;
		this.once = once;
	}

	public destroy() {
		this.signal.remove(this);
	}
}

export class Signal<T = void> {
	private readonly bindings = new Set<SignalBinding<T>>();

	public add(cb: (value: T) => void): SignalBinding<T> {
		const binding = new SignalBinding(this, cb, false);
		this.bindings.add(binding);

		return binding;
	}

	public addOnce(cb: (value: T) => void): SignalBinding<T> {
		const binding = new SignalBinding(this, cb, true);
		this.bindings.add(binding);

		return binding;
	}

	public addScript(
		script: { onMessage: Signal<Message> },
		cb: (value: T) => void,
	) {
		return this.addScripInternal(script, cb, false);
	}

	public addScriptOnce(
		script: { onMessage: Signal<Message> },
		cb: (value: T) => void,
	) {
		return this.addScripInternal(script, cb, true);
	}

	private addScripInternal(
		script: { onMessage: Signal<Message> },
		cb: (value: T) => void,
		once: boolean,
	) {
		const url = msg.url('.');
		const wrapper = (value: T) => {
			script.onMessage.addOnce(() => cb(value));
			msg.post(url, '__signal');
		};

		return once ? this.addOnce(wrapper) : this.add(wrapper);
	}

	public dispatch(value: T) {
		for (const binding of this.bindings) {
			binding.cb(value);

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
