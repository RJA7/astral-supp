import { Cursor } from './entities/Cursor';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { Ref } from '../types/Ref';
import { Player } from './entities/Player';
import { GameObject } from '../engine/GameObject';
import { Controller } from '../types/Controller';
import { Message } from '../types/Message';
import { ComponentUrl } from '../engine/ComponentUrl';
import { MessageId } from '../types/MessageId';

const SENSITIVITY = 3; // scales raw input
const DAMPING = 0.5;
const MAX_CURSOR_OFFSET = 35;
const CURSOR_FOLLOW = 0.1; // 0..1 (lower = heavier)

export class CoreRoot extends GameObject implements Controller {
	private readonly player: Player;
	private readonly cursor: Cursor;

	private isPointerDown = false;
	private pointerSpeed = vmath.vector3();
	private cursorOffset = vmath.vector3();

	constructor(ref: Ref) {
		super(ref);

		this.player = new Player(Ref.PlayerGO);
		this.cursor = new Cursor(Ref.CursorGO);

		this.cursor.setMouseLocked(true);
		this.cursor.setPosition2D(this.player.getPosition());
	}

	update(dt: number) {
		this.player.addPosition2D(this.pointerSpeed.mul(dt));
		this.pointerSpeed = this.pointerSpeed.mul(DAMPING);
	}

	onMessage(_message: Message, _sender: ComponentUrl): void {}

	onInput(actionId: ActionId, action: Action): void {
		const isTouch = actionId === ActionId.touch;
		const isMoving = action.dx !== 0 || action.dy !== 0;

		if (isTouch && action.released) {
			this.isPointerDown = false;
			this.cursor.show();
		} else if (isTouch && action.pressed) {
			this.isPointerDown = true;
			this.cursorOffset = this.cursor
				.getPosition()
				.sub(this.player.getPosition());
			this.cursor.hide();
		}

		if (this.isPointerDown && isMoving) {
			const delta = vmath.vector3(action.dx, action.dy, 0);
			this.pointerSpeed = this.pointerSpeed.add(delta.mul(SENSITIVITY));
		}

		if (!this.isPointerDown && isMoving) {
			const delta = vmath.vector3(action.dx, action.dy, 0);
			const playerPos = this.player.getPosition();

			let offset = this.cursor.getPosition().sub(playerPos);
			offset = offset.add(delta);

			const len = vmath.length(offset);
			if (len > MAX_CURSOR_OFFSET) {
				offset = offset.mul(MAX_CURSOR_OFFSET / len);
			}

			this.cursorOffset = vmath.lerp(
				CURSOR_FOLLOW,
				this.cursorOffset,
				offset,
			) as vmath.vector3;
			this.cursor.setPosition2D(playerPos.add(this.cursorOffset));
		} else {
			this.cursor.setPosition2D(
				this.player.getPosition().add(this.cursorOffset),
			);
		}
	}
}
