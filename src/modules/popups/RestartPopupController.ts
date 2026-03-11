import { Controller } from '../types/Controller';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { Signal } from '../engine/Signal';

export class RestartPopupController extends Controller {
	public onRestartClick = new Signal();

	private readonly dimmer: node;
	private readonly root: node;
	private readonly title: node;
	private readonly restartButton: node;

	constructor(props: { win: boolean }) {
		super();

		this.dimmer = gui.get_node('dimmer');
		this.root = gui.get_node('root');
		this.title = gui.get_node('title');
		this.restartButton = gui.get_node('restart_button');

		gui.set_text(this.title, props.win ? 'You Win!' : 'You Lose!');

		this.playShowAnimation();
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

	private playShowAnimation() {
		const position = gui.get_position(this.root);

		gui.set_alpha(this.dimmer, 0);
		gui.set_position(
			this.root,
			vmath.vector3(position.x, position.y + 500, position.z),
		);

		gui.animate(this.dimmer, 'color.w', 0.8, go.EASING_LINEAR, 0.3);
		gui.animate(this.root, 'position.y', position.y, go.EASING_OUTBACK, 0.5);
	}
}
