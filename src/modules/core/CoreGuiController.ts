import { Controller } from '../types/Controller';
import { MessageId } from '../types/MessageId';

export class CoreGuiController extends Controller {
	private readonly lifeText: node;

	constructor() {
		super();

		this.lifeText = gui.get_node('life_text');

		this.messenger.on(MessageId.PlayerHpChanged, (message) => {
			gui.set_text(this.lifeText, message.hp);
		});
	}
}
