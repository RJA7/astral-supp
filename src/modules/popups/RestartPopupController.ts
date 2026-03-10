import { Controller } from '../types/Controller';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { Signal } from '../engine/Signal';

export class RestartPopupController extends Controller {
	public onRestartClick = new Signal();

	private readonly title: node;
	private readonly restartButton: node;

	constructor(props: { win: boolean }) {
		super();

		this.title = gui.get_node('title');
		this.restartButton = gui.get_node('restart_button');

		gui.set_text(this.title, props.win ? 'You Win!' : 'You Lose!');
	}

	public onInput(actionId: ActionId, action: Action) {
		if (actionId !== ActionId.touch) return;

		if (
			action.pressed &&
			gui.pick_node(this.restartButton, action.x, action.y)
		) {
			this.onRestartClick.dispatch();
		}
	}
}
