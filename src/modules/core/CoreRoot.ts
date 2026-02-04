import { Cursor } from './entities/Cursor';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { Ref } from '../types/Ref';
import { Player } from './entities/Player';
import { GameObject } from '../engine/GameObject';
import { Controller } from '../types/Controller';

const SENSITIVITY = 3; // scales raw input

export class CoreRoot extends GameObject implements Controller {
	private readonly player: Player;
	private readonly cursor: Cursor;

	private isPointerDown = false;
	private pointerSpeed = vmath.vector3();

	constructor(ref: Ref) {
		super(ref);

		this.player = new Player(Ref.PlayerGO);
		this.cursor = new Cursor(Ref.CursorGO);

		this.cursor.setMouseLocked(true);
		this.cursor.setPosition(this.player.getPosition());
	}

	update(dt: number) {
		this.player.setPosition(
			this.player.getPosition().add(this.pointerSpeed.mul(dt)),
		);
		this.pointerSpeed = this.pointerSpeed.mul(0.5);
	}

	onInput(actionId: ActionId, action: Action): void {
		const isTouch = actionId === ActionId.touch;

		if (isTouch && action.released) {
			this.isPointerDown = false;
			this.cursor.show();
		} else if (isTouch && action.pressed) {
			this.isPointerDown = true;
			this.cursor.hide();
		}

		if (this.isPointerDown && (action.dx !== 0 || action.dy !== 0)) {
			const delta = vmath.vector3(action.dx, action.dy, 0);
			this.pointerSpeed = this.pointerSpeed.add(delta.mul(SENSITIVITY));
		}
	}
}
