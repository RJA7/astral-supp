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

export class CoreController extends Controller {
	private readonly layout: CoreLayout;
	private readonly input: CoreInput;
	private readonly player: Player;
	private readonly cursor: Cursor;
	private readonly level: CoreLevel;
	private readonly physics: CorePhysics;
	private state: CoreState;

	constructor() {
		super();

		this.state = new CoreState();

		this.layout = createCollectionLayout(coreSchema);
		this.layout.root.acquireInputFocus();

		this.input = new CoreInput();
		this.player = new Player(this.layout.player);
		this.cursor = new Cursor(this.layout.cursor);
		this.level = new CoreLevel(this.state, this.layout);
		this.physics = new CorePhysics(this.state, this.layout.player_center.id);
	}

	update(_dt: number) {
		this.cursor.update(
			this.layout.player.getPosition(),
			this.input.getDelta(),
			this.input.isPointerDown(),
		);
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

	final() {
		this.layout.root.releaseInputFocus();
	}
}
