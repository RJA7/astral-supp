import { Message } from '../types/Message';
import { Signal } from './Signal';
import { ComponentUrl } from './ComponentUrl';

export class Messenger {
	private messageSignal = new Signal<[Message, ComponentUrl]>();

	public onMessage(message: Message, sender: ComponentUrl) {
		this.messageSignal.dispatch(message, sender);
	}

	public on<T extends Message['mid']>(
		type: T,
		cb: (message: Message & { mid: T }, sender: ComponentUrl) => void,
	) {
		return this.messageSignal.add((message, sender) => {
			if (message.mid !== type) return;
			cb(message as Message & { mid: T }, sender);
		});
	}

	public once<T extends Message['mid']>(
		type: T,
		cb: (message: Message & { mid: T }, sender: ComponentUrl) => void,
	) {
		const binding = this.messageSignal.addOnce((message, sender) => {
			if (message.mid !== type) return;

			binding.destroy();
			cb(message as Message & { mid: T }, sender);
		});

		return binding;
	}

	public wrapCrossScript<T extends (...args: any) => any>(cb: T): T {
		const url = msg.url('.');

		return ((...args: any[]) => {
			this.messageSignal.addOnce(() => cb(...args));
			msg.post(url, '__signal');
		}) as T;
	}

	public final() {
		this.messageSignal.removeAll();
	}
}
