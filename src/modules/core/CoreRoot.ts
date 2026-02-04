import { Cursor } from './entities/Cursor';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { Ref } from '../types/Ref';
import { Player } from './entities/Player';
import { GameObject } from '../engine/GameObject';
import { MessageId } from '../types/MessageId';

export class CoreRoot extends GameObject {
	private readonly player: Player;
	private readonly cursor: Cursor;

	private isPointerDown = false;

	constructor(ref: Ref) {
		super(ref);

		this.player = new Player(Ref.PlayerGO);
		this.cursor = new Cursor(Ref.CursorGO);

		this.postMessage({ id: MessageId.acquire_input_focus });
		this.cursor.setMouseLocked(true);
		this.cursor.setPosition(this.player.getPosition());
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

		if (isTouch && this.isPointerDown) {
			const delta = vmath.vector3(action.screen_dx, action.screen_dy, 0);
			const normal = vmath.normalize(delta);
			const length = vmath.length(delta);
			const step = normal.mul(Math.min(5, length));

			this.player.setPosition(this.player.getPosition().add(step));
		}
	}
}
