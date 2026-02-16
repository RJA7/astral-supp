import { Controller } from '../../types/Controller';
import { GameObject } from '../../engine/GameObject';
import { Message } from '../../types/Message';
import { ComponentUrl } from '../../engine/ComponentUrl';
import { PlayerPhysics } from './PlayerPhysics';

export class PlayerRoot extends GameObject implements Controller {
	private readonly physics = new PlayerPhysics();

	onMessage(message: Message, sender: ComponentUrl): void {
		this.physics.onMessage(message, sender);
	}

	public update() {
		this.physics.update();
	}
}
