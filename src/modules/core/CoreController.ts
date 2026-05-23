import {
	Action,
	ActionId,
	Controller,
	createCollectionLayout,
	Popups,
	Signal,
} from '../engine';
import { readClipboard } from '../engine/utils/Clipboard';
import { Cursor } from './entities/Cursor';
import { Player } from './entities/Player';
import { CoreInput } from './CoreInput';
import { CorePhysics } from './CorePhysics';
import { CoreLevel } from './CoreLevel';
import { CoreLayout, coreSchema } from '../layouts/CoreLayout';
import { CoreState } from './CoreState';
import { PopupName } from '../enums/PopupName';
import { levels } from './data/levels';
import { storage } from '../services/Storage';
import { ControllerName } from '../enums/ControllerName';
import { LevelData } from './types/LevelData';

export class CoreController extends Controller {
	public onRestart = new Signal();

	private readonly layout: CoreLayout;

	private readonly input: CoreInput;

	private readonly popups: Popups;

	private readonly level: CoreLevel;

	private readonly physics: CorePhysics;

	private readonly state: CoreState;

	private player!: Player;

	private cursor!: Cursor;

	private isTestLevel = false;

	constructor() {
		super();

		this.state = new CoreState();

		this.layout = createCollectionLayout(coreSchema);
		this.input = new CoreInput();
		this.popups = new Popups(this.messenger);
		this.physics = new CorePhysics(this.state);
		this.level = new CoreLevel(this.layout, this.physics);

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
			this.input.resetPointerDown();

			if (this.isTestLevel) {
				this.isTestLevel = false;
				this.startLevel(storage.data.levelIndex);
				return;
			}

			const nextLevelNumber = storage.data.levelIndex + 1;

			if (nextLevelNumber < levels.length) {
				this.startLevel(nextLevelNumber);
				return;
			}

			this.cursor.setMouseLocked(false);
			this.showRestartPopup(true);
		});

		this.startLevel(storage.data.levelIndex);
		this.enablePhysics();
	}

	update(_dt: number) {
		if (!this.player) return;

		this.cursor.update(
			this.player.getPosition(),
			this.input.getDelta(),
			this.input.isPointerDown(),
		);
		this.input.resetDelta();
	}

	fixedUpdate(dt: number) {
		if (!this.player) return;

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

		if (this.input.isMiddleClick()) {
			this.input.resetMiddleClick();
			this.tryTestLevel();
		}
	}

	private tryTestLevel() {
		const text = readClipboard();
		if (text === undefined) return;

		const raw = this.parseJson(text);
		if (!this.isValidLevelData(raw)) return;

		this.startTestLevel(raw);
	}

	private parseJson(text: string): unknown {
		try {
			return json.decode(text);
		} catch (_e) {
			return undefined;
		}
	}

	private isValidLevelData(data: unknown): data is LevelData {
		if (typeof data !== 'object') return false;
		if (data === undefined) return false;
		const d = data as Record<string, unknown>;
		return (
			typeof d.safeZones === 'object' &&
			d.safeZones !== undefined &&
			typeof d.finishZone === 'object' &&
			d.finishZone !== undefined &&
			typeof d.playerPosition === 'object' &&
			d.playerPosition !== undefined &&
			typeof d.shooters === 'object' &&
			d.shooters !== undefined &&
			typeof d.walls === 'object' &&
			d.walls !== undefined
		);
	}

	private startTestLevel(levelData: LevelData) {
		this.isTestLevel = true;

		const result = this.level.startLevelWithData(levelData);
		this.player = result.player;
		this.cursor = result.cursor;

		timer.delay(0.01, false, () => {
			this.state.gameOver = false;
			this.physics.onLevelChanged();
		});
	}

	private startLevel(levelNumber: number) {
		storage.save({ levelIndex: levelNumber });

		const result = this.level.startLevel(levelNumber);
		this.player = result.player;
		this.cursor = result.cursor;

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
			storage.save({ levelIndex: 0 });
			this.onRestart.dispatch();
		};

		popup.script.bridge.onRestartClick = () => this.onRestart.dispatch();
	}
}
