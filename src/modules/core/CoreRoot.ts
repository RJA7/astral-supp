import { Cursor } from './entities/Cursor';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { Ref } from '../types/Ref';
import { Player } from './entities/Player';
import { GameObject } from '../engine/GameObject';
import { Controller } from '../types/Controller';
import { Message } from '../types/Message';
import { ComponentUrl } from '../engine/ComponentUrl';
import { CoreInput } from './CoreInput';
import { CorePhysics } from './CorePhysics';
import { PhysicsEvent } from '../types/Physics';
import { CoreLevel } from './CoreLevel';
import { level1 } from './levels/level1';
import { GameObjectId } from '../types/GameObjectId';

export class CoreRoot extends GameObject implements Controller {
	private readonly input: CoreInput;
	private readonly player: Player;
	private readonly cursor: Cursor;
	private readonly level: CoreLevel;
	private readonly physics: CorePhysics;

	constructor(ref: Ref) {
		super(ref);

		this.input = new CoreInput();
		this.player = new Player(GameObjectId.player);
		this.cursor = new Cursor(GameObjectId.cursor);
		this.level = new CoreLevel(level1);
		this.physics = new CorePhysics();

		this.player.setPosition2D(this.level.getPlayerPosition());
		this.cursor.setPosition2D(this.player.getPosition());
	}

	update(dt: number) {
		this.cursor.update(
			this.player.getPosition(),
			this.input.getDelta(),
			this.input.isPointerDown(),
		);
	}

	fixedUpdate(dt: number) {
		this.player.fixedUpdate(
			dt,
			this.input.getDelta(),
			this.input.isPointerDown(),
		);
	}

	onMessage(_message: Message, _sender: ComponentUrl): void {}

	onInput(actionId: ActionId, action: Action): void {
		this.input.onInput(actionId, action);
	}

	physicsListener(events: PhysicsEvent[]): void {
		this.physics.handleEvents(events);
	}
}
