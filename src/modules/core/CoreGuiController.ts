import { Controller } from '../types/Controller';
import { MessageId } from '../types/MessageId';

export class CoreGuiController extends Controller {
	private readonly lifeText: node;

	constructor(_props: object) {
		super();

		this.lifeText = gui.get_node('life_text');
	}

	public setPlayerHp(value: number) {
		gui.set_text(this.lifeText, value);
	}

	public final() {
		msg.post('.', MessageId.release_input_focus);
	}
}
