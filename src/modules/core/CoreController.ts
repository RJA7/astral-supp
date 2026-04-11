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
import { CoreState } from './CoreState';
import { Popups } from '../engine/popups/Popups';
import { PopupName } from '../engine/popups/types/PopupName';
import { Signal } from '../engine/Signal';
import { levels } from './levels/levels';
import { storage } from '../services/Storage';

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
		this.level = new CoreLevel(this.layout);
		this.physics = new CorePhysics(this.state, this.layout.player_center.id);

		this.layout.hud.gui.initController({
			playerHp: this.state.playerHp,
		});

		this.state.onPlayerHpChanged.add(() => {
			this.layout.hud.gui.call('setPlayerHp', this.state.playerHp);

			if (this.state.playerHp === 0) {
				this.cursor.setMouseLocked(false);
				this.showRestartPopup(false);
			}
		});

		this.state.onFinished.add(() => {
			const nextLevelNumber = storage.data.levelNumber + 1;
			this.input.resetPointerDown();

			if (levels[nextLevelNumber]) {
				this.startLevel(nextLevelNumber);
				return;
			}

			this.cursor.setMouseLocked(false);
			this.showRestartPopup(true);
		});

		physics.set_event_listener(this.physicsListener.bind(this));

		this.startLevel(storage.data.levelNumber);
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
		this.physics.fixedUpdate();
	}

	onResize(): void {
		this.level.resize();
	}

	onInput(actionId: ActionId, action: Action): void {
		this.input.onInput(actionId, action);
	}

	physicsListener(events: PhysicsEvent[]): void {
		this.physics.handleEvents(events);
	}

	private startLevel(levelNumber: number) {
		storage.save({ levelNumber });
		this.level.startLevel(levelNumber);

		timer.delay(0.01, false, () => {
			this.state.gameOver = false;
			this.physics.onLevelChanged();
		});
	}

	private showRestartPopup(win: boolean) {
		const popup = this.popups.show(PopupName.restart, { win });

		popup.script.bridge.onResetClick = () => {
			storage.save({ levelNumber: 1 });
			this.onRestart.dispatch();
		};

		popup.script.bridge.onRestartClick = () => this.onRestart.dispatch();
	}
}
