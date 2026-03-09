import { Controller } from '../types/Controller';
import { MessageId } from '../types/MessageId';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { ScriptBridge } from '../engine/ScriptBridge';
import { ControllerName } from '../ControllerName';

export class CoreGuiController extends Controller {
	private readonly mainBridge: ScriptBridge<ControllerName.MainController>;

	private readonly lifeText: node;
	private readonly popupOverlay: node;
	private readonly restartPopup: node;
	private readonly restartTitle: node;
	private readonly restartButton: node;

	constructor() {
		super();

		msg.post('.', MessageId.acquire_input_focus);

		this.mainBridge = new ScriptBridge('main:/root');

		this.lifeText = gui.get_node('life_text');
		this.popupOverlay = gui.get_node('popup_overlay');
		this.restartPopup = gui.get_node('restart_popup');
		this.restartTitle = gui.get_node('restart_title');
		this.restartButton = gui.get_node('restart_button');
	}

	public showRestartPopup(win: boolean) {
		gui.set_text(this.restartTitle, win ? 'You Win!' : 'You Lose!');
		gui.set_enabled(this.popupOverlay, true);
		gui.set_enabled(this.restartPopup, true);
	}

	public setPlayerHp(value: number) {
		gui.set_text(this.lifeText, value);
	}

	public onInput(actionId: ActionId, action: Action) {
		if (actionId !== ActionId.touch) return;

		if (
			action.pressed &&
			gui.pick_node(this.restartButton, action.x, action.y)
		) {
			this.mainBridge.call('restart');
		}
	}

	public final() {
		msg.post('.', MessageId.release_input_focus);
	}
}
