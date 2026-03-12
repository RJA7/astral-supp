import { Cursor } from './entities/Cursor';
import { ActionId } from '../types/ActionId';
import { Action } from '../types/Action';
import { Player } from './entities/Player';
import { Controller } from '../types/Controller';
import { CoreInput } from './CoreInput';
import { CorePhysics } from './CorePhysics';
import { PhysicsEvent } from '../types/Physics';
import { CoreLevel } from './CoreLevel';
import { CoreLayout, coreSchema } from '../layouts/CoreLayout';
import { createCollectionLayout } from '../engine/layout/CollectionLayout';
import { screen } from '../engine/render/Screen';
import { CoreState } from './CoreState';
import { Popups } from '../engine/popups/Popups';
import { PopupName } from '../engine/popups/types/PopupName';
import { Signal } from '../engine/Signal';

export class CoreController extends Controller {
	public onRestart = new Signal();

	private readonly layout: CoreLayout;
	private readonly input: CoreInput;
	private readonly popups: Popups;
	private readonly player: Player;
	private readonly cursor: Cursor;
	private readonly level: CoreLevel;
	private readonly physics: CorePhysics;
	private readonly state: CoreState;

	constructor() {
		super();

		this.state = new CoreState();

		this.layout = createCollectionLayout(coreSchema);
		this.input = new CoreInput();
		this.popups = new Popups(this.messenger);
		this.player = new Player(this.layout.player);
		this.cursor = new Cursor(this.layout.cursor);
		this.level = new CoreLevel(this.state, this.layout);
		this.physics = new CorePhysics(this.state, this.layout.player_center.id);

		this.layout.hud.gui.initController({
			playerHp: this.state.playerHp,
		});

		this.state.onPlayerHpChanged.add(() => {
			this.layout.hud.gui.call('setPlayerHp', this.state.playerHp);

			if (this.state.playerHp === 0) {
				this.cursor.setMouseLocked(false);

				const popup = this.popups.show(PopupName.restart, { win: false });
				popup.script.bridge.onRestartClick = () => this.onRestart.dispatch();
			}
		});

		physics.set_event_listener(this.physicsListener.bind(this));
	}

	update(_dt: number) {
		this.cursor.update(
			this.layout.player.getPosition(),
			this.input.getDelta(),
			this.input.isPointerDown(),
		);
		this.input.resetDelta();
	}

	fixedUpdate(dt: number) {
		this.player.fixedUpdate(
			dt,
			this.input.getDelta(),
			this.input.isPointerDown(),
		);
	}

	onResize(): void {
		this.layout.vignette.sprite.width = screen.width;
		this.layout.vignette.sprite.height = screen.height;
		this.level.resize();
	}

	onInput(actionId: ActionId, action: Action): void {
		this.input.onInput(actionId, action);
	}

	physicsListener(events: PhysicsEvent[]): void {
		this.physics.handleEvents(events);
	}
}
