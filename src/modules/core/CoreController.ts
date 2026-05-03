import {
	Action,
	ActionId,
	Controller,
	createCollectionLayout,
	Popups,
	Signal,
} from '../engine';
import { Cursor } from './entities/Cursor';
import { Player } from './entities/Player';
import { CoreInput } from './CoreInput';
import { CorePhysics } from './CorePhysics';
import { CoreLevel } from './CoreLevel';
import { CoreLayout, coreSchema } from '../layouts/CoreLayout';
import { CoreState } from './CoreState';
import { PopupName } from '../enums/PopupName';
import { levels } from './levels/levels';
import { storage } from '../services/Storage';
import { ControllerName } from '../enums/ControllerName';

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
		this.physics = new CorePhysics(this.state, this.layout);

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

		this.startLevel(storage.data.levelNumber);
		this.enablePhysics();
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

	private startLevel(levelNumber: number) {
		storage.save({ levelNumber });
		this.level.startLevel(levelNumber);

		timer.delay(0.01, false, () => {
			this.state.gameOver = false;
			this.physics.onLevelChanged();
		});
	}

	private showRestartPopup(win: boolean) {
		const popup = this.popups.show(
			PopupName.restart,
			ControllerName.RestartPopupController,
			{ win },
		);

		popup.script.bridge.onResetClick = () => {
			storage.save({ levelNumber: 1 });
			this.onRestart.dispatch();
		};

		popup.script.bridge.onRestartClick = () => this.onRestart.dispatch();
	}
}
