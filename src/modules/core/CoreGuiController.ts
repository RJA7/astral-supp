import { Controller, MessageId } from '../engine';

export class CoreGuiController extends Controller {
	private readonly lifeText: node;

	constructor(props: { playerHp: number }) {
		super();

		this.lifeText = gui.get_node('life_text');
		this.setPlayerHp(props.playerHp);
	}

	public setPlayerHp(value: number) {
		gui.set_text(this.lifeText, value);
	}

	public final() {
		msg.post('.', MessageId.release_input_focus);
	}
}
