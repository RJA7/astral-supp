import {
	Action,
	ActionId,
	Controller,
	createGuiLayout,
	GuiLayout,
	guiNode,
	GuiSchema,
	Signal,
} from '../engine';
import { playPopupOpening } from '../animations/PlayPopupOpening';

const restartPopupSchema = {
	dimmer: guiNode(),
	root: guiNode(),
	title: guiNode(),
	reset_button: guiNode(),
	restart_button: guiNode(),
} satisfies GuiSchema;

type RestartPopupLayout = GuiLayout<typeof restartPopupSchema>;

export class RestartPopupController extends Controller {
	public onResetClick = new Signal();

	public onRestartClick = new Signal();

	private readonly layout: RestartPopupLayout;

	constructor(props: { win: boolean }) {
		super();

		this.layout = createGuiLayout(restartPopupSchema);
		this.layout.title.text = props.win ? 'You Win!' : 'You Lose!';

		playPopupOpening(this.layout);
	}

	public onInput(actionId: ActionId, action: Action) {
		if (actionId !== ActionId.touch) return;

		if (action.pressed && this.layout.reset_button.pick(action.x, action.y)) {
			this.onResetClick.dispatch();
		}

		if (action.pressed && this.layout.restart_button.pick(action.x, action.y)) {
			this.onRestartClick.dispatch();
		}
	}
}
