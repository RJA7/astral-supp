# Data-Driven Levels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace per-level TypeScript classes (Level1–4) with a single generic `Level` class driven by JSON-like data files, fixing all build errors introduced by commit 5efa1bb.

**Architecture:** `CorePhysics` receives a `LevelLayout` via `setLayout()` on each level start; `CoreLevel` instantiates the shared `level.collection`, creates safe zones from data, and hands control to `Level`; `Level` runs keyframe-based animation tracks and shooter loops via `Timeline`. Old `Level1–4.ts` files and `levels.ts` are deleted.

**Tech Stack:** TypeScript → Lua (tstl), Defold engine, Timeline/tween system, `npm run build` for verification (no test framework).

---

## File Map

| File | Action |
|------|--------|
| `src/modules/core/types/LevelData.ts` | Add `AnimationTrack`, `AnimationKeyframe`; extend `ShooterData` |
| `src/modules/layouts/LevelLayout.ts` | Add `finish_zone`, `shooter`, `bullets` to schema |
| `src/modules/core/helpers/CreateLevelLayout.ts` | Simplify — always load `level.collectionc` |
| `src/modules/core/entities/Player.ts` | Fix import path; add `getPosition()` |
| `src/modules/core/entities/Cursor.ts` | Fix import path |
| `src/modules/core/CorePhysics.ts` | Remove `CoreLayout` dep; add `setLayout(LevelLayout)` |
| `src/modules/core/levels/Level.ts` | New — generic level runner |
| `src/modules/core/CoreLevel.ts` | Full rework |
| `src/modules/core/CoreController.ts` | Player/cursor per-level; physics init order |
| `src/modules/services/Storage.ts` | Default `levelNumber: 0`; remove debug line |
| `src/modules/core/data/levels/level_0.ts` | Fill with old Level1 data |
| `src/modules/core/data/levels/level_1.ts` | New — old Level2 data |
| `src/modules/core/data/levels/level_2.ts` | New — old Level3 data |
| `src/modules/core/data/levels/level_3.ts` | New — old Level4 data |
| `src/modules/core/data/levels.ts` | Export all 4 levels |
| `src/modules/core/levels/Level1–4.ts` | Delete |
| `src/modules/core/levels/levels.ts` | Delete |

---

### Task 1: Update `LevelData.ts` — add animation types and extend ShooterData

**Files:**
- Modify: `src/modules/core/types/LevelData.ts`

- [ ] **Step 1: Replace file contents**

```typescript
export type LevelData = {
	safeZones: SafeZoneData[];
	finishZone: FinishZoneData;
	playerPosition: PointData;
	shooters: ShooterData[];
	animations: AnimationTrack[];
};

export type AnimationTrack = {
	target: string;       // "safe_zones[0]", "shooter", "finish_zone"
	property: string;     // "scale" | "scale.x" | "scale.y" | "position.x" | "position.y" | "euler.z"
	keyframes: AnimationKeyframe[];
	loop?: boolean;
	loopDuration?: number;
};

export type AnimationKeyframe = {
	time: number;   // seconds from track start
	value: number;
};

export type SafeZoneData = RectZoneData & {
	id: string;
};

export type FinishZoneData = RectZoneData;

export type RectZoneData = {
	x: number;
	y: number;
	width: number;
	height: number;
	angle: number;
};

export type PointData = {
	x: number;
	y: number;
};

export type ShooterData = {
	x: number;
	y: number;
	angle: number;
	fireInterval: number;
	bulletCount?: number;
	bulletSpread?: number;
};
```

- [ ] **Step 2: Verify build compiles this file cleanly**

Run: `npm run build`
Expected: same number of errors as before (no new errors; existing errors from other files are expected)

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/types/LevelData.ts
git commit -m "feat: add AnimationTrack, AnimationKeyframe; extend ShooterData"
```

---

### Task 2: Update `LevelLayout.ts` — add finish_zone, shooter, bullets

**Files:**
- Modify: `src/modules/layouts/LevelLayout.ts`

- [ ] **Step 1: Replace file contents**

```typescript
import {
	CollectionLayout,
	CollectionSchema,
	Factory,
	list,
	Sprite,
} from '../engine';

export const levelSchema = {
	root: {},
	finish_zone: {},
	player: {},
	player_center: {},
	player_edges: list({}),
	cursor: {
		sprite: Sprite,
	},
	safe_zones: {
		factory: Factory,
	},
	shooter: {},
	bullets: {
		factory: Factory,
	},
} satisfies CollectionSchema;

export type LevelLayout = CollectionLayout<typeof levelSchema>;

export type PlayerLayout = LevelLayout['player'];

export type CursorLayout = LevelLayout['cursor'];
```

- [ ] **Step 2: Run build — note any new errors**

Run: `npm run build`
Expected: error count may change; `finish_zone`, `shooter`, `bullets` now typed on `LevelLayout`.

- [ ] **Step 3: Commit**

```bash
git add src/modules/layouts/LevelLayout.ts
git commit -m "feat: add finish_zone, shooter, bullets to LevelLayout schema"
```

---

### Task 3: Simplify `CreateLevelLayout.ts`

**Files:**
- Modify: `src/modules/core/helpers/CreateLevelLayout.ts`

- [ ] **Step 1: Replace file contents**

```typescript
import { CollectionFactory } from '../../engine';
import { levelSchema } from '../../layouts/LevelLayout';

export function createLevelLayout(level_factory: CollectionFactory) {
	level_factory.setPrototype('/main/core/level.collectionc');
	return level_factory.createLayout(levelSchema);
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Level1–4.ts will now show new errors about missing `levelNumber` param — that's fine, those files get deleted later.

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/helpers/CreateLevelLayout.ts
git commit -m "refactor: CreateLevelLayout always loads level.collectionc"
```

---

### Task 4: Fix `Player.ts` and `Cursor.ts` import paths; add `getPosition` to Player

**Files:**
- Modify: `src/modules/core/entities/Player.ts`
- Modify: `src/modules/core/entities/Cursor.ts`

- [ ] **Step 1: Replace `Player.ts`**

```typescript
import { PlayerLayout } from '../../layouts/LevelLayout';

// Max jump per physics iteration. This limits how close safe zones can be
const SENSITIVITY = 0.2;

export class Player {
	private readonly layout: PlayerLayout;

	constructor(layout: PlayerLayout) {
		this.layout = layout;
	}

	public getPosition(): vmath.vector3 {
		return this.layout.getPosition();
	}

	public fixedUpdate(
		_dt: number,
		inputDelta: vmath.vector3,
		isPointerDown: boolean,
	) {
		if (!isPointerDown) return;
		this.layout.addPosition2D(inputDelta.mul(SENSITIVITY));
	}
}
```

- [ ] **Step 2: Fix `Cursor.ts` import — change line 2**

Change:
```typescript
import { CursorLayout } from '../../layouts/CoreLayout';
```
To:
```typescript
import { CursorLayout } from '../../layouts/LevelLayout';
```

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Player and Cursor import errors resolved.

- [ ] **Step 4: Commit**

```bash
git add src/modules/core/entities/Player.ts src/modules/core/entities/Cursor.ts
git commit -m "fix: fix Player/Cursor imports to use LevelLayout; add Player.getPosition"
```

---

### Task 5: Rework `CorePhysics.ts` — remove CoreLayout dep, add setLayout

**Files:**
- Modify: `src/modules/core/CorePhysics.ts`

- [ ] **Step 1: Replace file contents**

```typescript
import { GameObjectId } from '../engine';
import { PhysicsGroup } from '../enums/PhysicsGroup';
import { CoreState } from './CoreState';
import { LevelLayout } from '../layouts/LevelLayout';

export class CorePhysics {
	private readonly state: CoreState;

	private isSafeById = new Map<GameObjectId, number>();

	private playerCenterId!: GameObjectId;

	constructor(state: CoreState) {
		this.state = state;
	}

	public setLayout(layout: LevelLayout): void {
		[layout.player_center, ...layout.player_edges].forEach((playerTrigger) => {
			[PhysicsGroup.safe_zone, PhysicsGroup.finish_zone].forEach((group) => {
				playerTrigger.physics.setHandler(group, (event) => {
					if (this.state.gameOver) return;

					const current = this.isSafeById.get(playerTrigger.id) ?? 0;

					if (event.enter) {
						this.isSafeById.set(playerTrigger.id, current + 1);
					} else {
						this.isSafeById.set(playerTrigger.id, Math.max(0, current - 1));
					}
				});
			});
		});

		layout.player.physics.setHandler(PhysicsGroup.finish_zone, () => {
			if (this.state.gameOver) return;
			this.state.finish();
		});

		layout.player.physics.setHandler(PhysicsGroup.bullet, () => {
			if (this.state.gameOver) return;
			this.state.setHp(0);
		});

		this.playerCenterId = layout.player_center.id;
	}

	public onLevelChanged() {
		this.isSafeById.clear();
	}

	private dispatchSignals() {
		if (this.state.gameOver) return;

		if (this.isSafeById.get(this.playerCenterId) === 0) {
			this.state.setHp(0);
			return;
		}

		let hp = this.state.playerHp;
		let changed = false;

		for (const [id] of this.isSafeById) {
			if (this.isSafeById.get(id) !== 0) continue;

			hp = Math.max(0, hp - 1);
			changed = true;
		}

		if (changed) {
			this.state.setHp(hp);
		}
	}

	public fixedUpdate() {
		if (this.state.gameOver) return;
		this.dispatchSignals();
	}
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: CorePhysics errors resolved; CoreController will show new errors (physics constructor changed) — expected.

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/CorePhysics.ts
git commit -m "refactor: CorePhysics uses setLayout per-level instead of CoreLayout in constructor"
```

---

### Task 6: Create generic `Level.ts`

**Files:**
- Create: `src/modules/core/levels/Level.ts`

- [ ] **Step 1: Create the file**

```typescript
import { DEG_TO_RAD, Property, Timeline } from '../../engine';
import { LevelLayout } from '../../layouts/LevelLayout';
import { SafeZoneLayout } from '../../layouts/SafeZoneLayout';
import { bulletSchema } from '../../layouts/BulletLayout';
import { AnimationTrack, LevelData, ShooterData } from '../types/LevelData';
import {
	syncSafeZoneCollider,
	syncSafeZoneTweenCollider,
} from '../helpers/SyncSafeZoneCollider';
import { PhysicsGroup } from '../../enums/PhysicsGroup';

export type LevelProps = {
	layout: LevelLayout;
	safeZones: SafeZoneLayout[];
	levelData: LevelData;
};

export class Level {
	public readonly layout: LevelLayout;

	private readonly safeZones: SafeZoneLayout[];

	private readonly levelData: LevelData;

	private readonly timeline: Timeline;

	constructor({ layout, safeZones, levelData }: LevelProps) {
		this.layout = layout;
		this.safeZones = safeZones;
		this.levelData = levelData;
		this.timeline = new Timeline();
	}

	public start(): void {
		for (const track of this.levelData.animations) {
			this.runTrack(track);
		}
		for (const shooter of this.levelData.shooters) {
			this.setupShooter(shooter);
		}
	}

	public destroy(): void {
		this.timeline.destroy();
	}

	private async runTrack(track: AnimationTrack): Promise<void> {
		const target = this.resolveTarget(track.target);
		const { group, axes } = this.parseProperty(track.property);
		const isSafeZone = track.target.startsWith('safe_zones[');
		const { keyframes, loop, loopDuration } = track;

		if (keyframes.length === 0) return;

		const lastKfTime = keyframes[keyframes.length - 1].time;
		const cycleDuration = loopDuration ?? lastKfTime;

		const runOnce = async () => {
			for (let i = 0; i < keyframes.length; i++) {
				const kf = keyframes[i];
				const prevTime = i > 0 ? keyframes[i - 1].time : 0;
				const duration = kf.time - prevTime;

				if (duration === 0) {
					this.applyValue(target, group, axes, kf.value, isSafeZone);
				} else {
					const tweenTarget = this.buildTweenTarget(axes, kf.value);
					const tween = this.timeline.tween(
						target as any,
						group,
						tweenTarget,
						duration,
					);
					if (isSafeZone) {
						tween.onUpdate(syncSafeZoneTweenCollider);
					}
					await this.timeline.wait(duration);
				}
			}
		};

		if (loop) {
			while (true) {
				await runOnce();
				const gap = cycleDuration - lastKfTime;
				if (gap > 0) await this.timeline.wait(gap);
			}
		} else {
			await runOnce();
		}
	}

	private resolveTarget(targetStr: string): SafeZoneLayout | any {
		if (targetStr.startsWith('safe_zones[')) {
			const index = tonumber(targetStr.slice(11, -1)) as number;
			return this.safeZones[index];
		}
		if (targetStr === 'shooter') return this.layout.shooter;
		if (targetStr === 'finish_zone') return this.layout.finish_zone;
		return this.layout.shooter;
	}

	private parseProperty(property: string): { group: string; axes: string[] } {
		if (property === 'scale') return { group: 'scale', axes: ['x', 'y'] };
		const dotIndex = property.indexOf('.');
		return {
			group: property.slice(0, dotIndex),
			axes: [property.slice(dotIndex + 1)],
		};
	}

	private buildTweenTarget(
		axes: string[],
		value: number,
	): Record<string, number> {
		const target: Record<string, number> = {};
		for (const axis of axes) target[axis] = value;
		return target;
	}

	private applyValue(
		obj: any,
		group: string,
		axes: string[],
		value: number,
		isSafeZone: boolean,
	): void {
		if (group === 'scale') {
			const s = obj.scale as vmath.vector3;
			const nx = axes.includes('x') ? value : s.x;
			const ny = axes.includes('y') ? value : s.y;
			obj.setScale2D(vmath.vector3(nx, ny, 1));
			if (isSafeZone) syncSafeZoneCollider(obj as SafeZoneLayout);
		} else if (group === 'euler') {
			go.set_euler(obj.id, vmath.vector3(0, 0, value));
		} else if (group === 'position') {
			const p = obj.position as vmath.vector3;
			const nx = axes.includes('x') ? value : p.x;
			const ny = axes.includes('y') ? value : p.y;
			obj.setPosition2D(vmath.vector3(nx, ny, 0));
		}
	}

	private setupShooter(data: ShooterData): void {
		const { shooter, bullets } = this.layout;

		shooter.setPosition2D(vmath.vector3(data.x, data.y, 0));
		bullets.setPosition2D(vmath.vector3(data.x, data.y, 0));

		this.timeline.loop(data.fireInterval, () => {
			const count = data.bulletCount ?? 1;
			const spread = data.bulletSpread ?? 0;

			for (let i = 0; i < count; i++) {
				const bullet = bullets.factory.create(bulletSchema);
				const offsetAngle = count > 1 ? i * spread - (spread * (count - 1)) / 2 : 0;
				const rotation = (shooter.angle + offsetAngle) * DEG_TO_RAD;
				const direction = vmath.vector3(
					Math.cos(rotation),
					Math.sin(rotation),
					0,
				);
				const distance = 1500;
				const target = bullet.getPosition().add(direction.mul(distance));

				bullet.animate(
					Property.Position,
					target,
					8,
					undefined,
					undefined,
					undefined,
					() => {
						bullet.delete();
					},
				);

				bullet.physics.setHandler(PhysicsGroup.wall, () => {
					bullet.delete();
				});
			}
		});
	}
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: `Level.ts` compiles; remaining errors are in `CoreLevel.ts`, `CoreController.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/levels/Level.ts
git commit -m "feat: create generic Level class with keyframe animation and shooter systems"
```

---

### Task 7: Rework `CoreLevel.ts`

**Files:**
- Modify: `src/modules/core/CoreLevel.ts`

- [ ] **Step 1: Replace file contents**

```typescript
import { CoreLayout } from '../layouts/CoreLayout';
import { CorePhysics } from './CorePhysics';
import { Level } from './levels/Level';
import { Player } from './entities/Player';
import { Cursor } from './entities/Cursor';
import { createLevelLayout } from './helpers/CreateLevelLayout';
import { safeZoneSchema } from '../layouts/SafeZoneLayout';
import { syncSafeZoneCollider } from './helpers/SyncSafeZoneCollider';
import { levels } from '../data/levels';

export class CoreLevel {
	private readonly coreLayout: CoreLayout;

	private readonly physics: CorePhysics;

	private level?: Level;

	constructor(coreLayout: CoreLayout, physics: CorePhysics) {
		this.coreLayout = coreLayout;
		this.physics = physics;
	}

	public startLevel(levelNumber: number): { player: Player; cursor: Cursor } {
		this.destroyCurrentLevel();

		const levelData = levels[levelNumber];
		const layout = createLevelLayout(this.coreLayout.root.level_factory);

		const safeZones = levelData.safeZones.map((zoneData) => {
			const safeZone = layout.safe_zones.factory.create(safeZoneSchema);
			safeZone.setPosition2D(vmath.vector3(zoneData.x, zoneData.y, 0));
			safeZone.setScale2D(vmath.vector3(zoneData.width, zoneData.height, 1));
			if (zoneData.angle !== 0) {
				go.set_euler(safeZone.id, vmath.vector3(0, 0, zoneData.angle));
			}
			syncSafeZoneCollider(safeZone);
			return safeZone;
		});

		layout.player.setPosition2D(
			vmath.vector3(levelData.playerPosition.x, levelData.playerPosition.y, 0),
		);
		layout.cursor.setPosition2D(
			vmath.vector3(levelData.playerPosition.x, levelData.playerPosition.y, 0),
		);
		layout.finish_zone.setPosition2D(
			vmath.vector3(levelData.finishZone.x, levelData.finishZone.y, 0),
		);
		layout.finish_zone.setScale2D(
			vmath.vector3(levelData.finishZone.width, levelData.finishZone.height, 1),
		);

		this.physics.setLayout(layout);

		this.level = new Level({ layout, safeZones, levelData });
		this.level.start();

		return {
			player: new Player(layout.player),
			cursor: new Cursor(layout.cursor),
		};
	}

	public resize(): void {}

	private destroyCurrentLevel(): void {
		if (!this.level) return;
		this.level.destroy();
		this.level.layout.root.delete();
		this.level = undefined;
	}
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: CoreLevel errors resolved; main remaining errors in `CoreController.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/CoreLevel.ts
git commit -m "refactor: rework CoreLevel to build levels from LevelData"
```

---

### Task 8: Update `CoreController.ts`

**Files:**
- Modify: `src/modules/core/CoreController.ts`

- [ ] **Step 1: Replace file contents**

```typescript
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
import { levels } from '../data/levels';
import { storage } from '../services/Storage';
import { ControllerName } from '../enums/ControllerName';

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
			const nextLevelNumber = storage.data.levelNumber + 1;
			this.input.resetPointerDown();

			if (nextLevelNumber < levels.length) {
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
	}

	private startLevel(levelNumber: number) {
		storage.save({ levelNumber });
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
			storage.save({ levelNumber: 0 });
			this.onRestart.dispatch();
		};

		popup.script.bridge.onRestartClick = () => this.onRestart.dispatch();
	}
}
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: CoreController errors resolved. Remaining errors should only be in old Level1–4.ts files.

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/CoreController.ts
git commit -m "refactor: CoreController gets player/cursor from startLevel; use levels.length for next-level check"
```

---

### Task 9: Fix `Storage.ts`

**Files:**
- Modify: `src/modules/services/Storage.ts`

- [ ] **Step 1: Replace file contents**

```typescript
import { Storage } from '../engine';

type UserData = {
	levelNumber: number;
};

export const storage = new Storage<UserData>('user_data', {
	levelNumber: 0,
});
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Storage errors resolved. Only old Level1–4.ts errors should remain.

- [ ] **Step 3: Commit**

```bash
git add src/modules/services/Storage.ts
git commit -m "fix: default levelNumber to 0; remove debug override"
```

---

### Task 10: Populate `level_0.ts` — old Level1 data

**Files:**
- Modify: `src/modules/core/data/levels/level_0.ts`

- [ ] **Step 1: Replace file contents**

Safe zones from `level_1.collection` (numeric order 0–7). Shooter at (-1, -37). Finish at (-245, -119) with no explicit scale (1×1).

```typescript
import { LevelData } from '../../types/LevelData';

export default {
	safeZones: [
		{ id: 'sz0', x: -508.3333, y: -53.0,      width: 60,   height: 500,  angle: 0 },
		{ id: 'sz1', x: 11.6667,   y: 166.6667,   width: 1000, height: 60,   angle: 0 },
		{ id: 'sz2', x: 488.3333,  y: -53.3333,   width: 60,   height: 500,  angle: 0 },
		{ id: 'sz3', x: 61.6667,   y: -273.3333,  width: 800,  height: 60,   angle: 0 },
		{ id: 'sz4', x: -368.3333, y: -103.3333,  width: 60,   height: 400,  angle: 0 },
		{ id: 'sz5', x: 3.3333,    y: 65.0,       width: 800,  height: 60,   angle: 0 },
		{ id: 'sz6', x: 373.3333,  y: -65.0,      width: 60,   height: 200,  angle: 0 },
		{ id: 'sz7', x: 101.6667,  y: -138.3333,  width: 600,  height: 60,   angle: 0 },
	],
	finishZone: { x: -245, y: -119, width: 1, height: 1, angle: 0 },
	playerPosition: { x: -0.999969, y: 168.66669 },
	shooters: [
		{ x: -1, y: -37, angle: 0, fireInterval: 0.5, bulletCount: 3, bulletSpread: 120 },
	],
	animations: [
		{
			target: 'shooter',
			property: 'euler.z',
			keyframes: [
				{ time: 0, value: 0 },
				{ time: 6, value: -360 },
			],
			loop: true,
			loopDuration: 6,
		},
	],
} satisfies LevelData;
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: `level_0.ts` compiles cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/data/levels/level_0.ts
git commit -m "feat: populate level_0 data (old Level1 — safe zones, shooter, rotation animation)"
```

---

### Task 11: Create `level_1.ts` — old Level2 data

**Files:**
- Create: `src/modules/core/data/levels/level_1.ts`

- [ ] **Step 1: Create the file**

Safe zones from `level_2.collection` (numeric order 0–8). No shooter. 8 animation tracks replicating Level2.ts yoyo tweens as mirrored keyframes.

Animation derivation:
- `safe_zones[1]` (`scale.x` 180→0.01→180, 0.5s each, 0.5s gap): loopDuration 1.5
- `safe_zones[2]` (`scale.x` 500→300→500, 1s each, 1s gap): loopDuration 3.0
- `safe_zones[2]` (`position.x` -315.33→-415.33→-315.33, 1s each, 1s gap): loopDuration 3.0
- `safe_zones[3]` (`scale.x` 500→700→500, 1s each, 1s gap): loopDuration 3.0
- `safe_zones[3]` (`position.x` 264.67→164.67→264.67, 1s each, 1s gap): loopDuration 3.0
- `safe_zones[6]` (`scale.x` 100→0.01→100, 0.5s each, 1s gap): loopDuration 2.0
- `safe_zones[7]` (`scale.x` 100 hold 0.5s, 100→0.01→100, 0.5s each, 1s gap): loopDuration 2.5
- `safe_zones[8]` (`scale.x` 100 hold 1s, 100→0.01→100, 0.5s each, 1s gap): loopDuration 3.0

```typescript
import { LevelData } from '../../types/LevelData';

export default {
	safeZones: [
		{ id: 'sz0', x: -475.3333, y: -202.0, width: 180,   height: 200,   angle: 0 },
		{ id: 'sz1', x: -475.3333, y: 19.0,   width: 180,   height: 246.8, angle: 0 },
		{ id: 'sz2', x: -315.3333, y: 169.0,  width: 500,   height: 60,    angle: 0 },
		{ id: 'sz3', x: 264.6667,  y: 169.0,  width: 500,   height: 60,    angle: 0 },
		{ id: 'sz4', x: -115.3333, y: 248.0,  width: 100,   height: 100,   angle: 0 },
		{ id: 'sz5', x: 464.6667,  y: 116.0,  width: 100,   height: 50,    angle: 0 },
		{ id: 'sz6', x: 464.6667,  y: 44.0,   width: 100,   height: 100,   angle: 0 },
		{ id: 'sz7', x: 464.6667,  y: -54.0,  width: 100,   height: 100,   angle: 0 },
		{ id: 'sz8', x: 464.6667,  y: -152.0, width: 100,   height: 100,   angle: 0 },
	],
	finishZone: { x: 465, y: -250, width: 1, height: 1, angle: 0 },
	playerPosition: { x: -477.99997, y: -271.3333 },
	shooters: [],
	animations: [
		{
			target: 'safe_zones[1]',
			property: 'scale.x',
			keyframes: [
				{ time: 0.5, value: 0.01 },
				{ time: 1.0, value: 180 },
			],
			loop: true,
			loopDuration: 1.5,
		},
		{
			target: 'safe_zones[2]',
			property: 'scale.x',
			keyframes: [
				{ time: 1.0, value: 300 },
				{ time: 2.0, value: 500 },
			],
			loop: true,
			loopDuration: 3.0,
		},
		{
			target: 'safe_zones[2]',
			property: 'position.x',
			keyframes: [
				{ time: 1.0, value: -415.3333 },
				{ time: 2.0, value: -315.3333 },
			],
			loop: true,
			loopDuration: 3.0,
		},
		{
			target: 'safe_zones[3]',
			property: 'scale.x',
			keyframes: [
				{ time: 1.0, value: 700 },
				{ time: 2.0, value: 500 },
			],
			loop: true,
			loopDuration: 3.0,
		},
		{
			target: 'safe_zones[3]',
			property: 'position.x',
			keyframes: [
				{ time: 1.0, value: 164.6667 },
				{ time: 2.0, value: 264.6667 },
			],
			loop: true,
			loopDuration: 3.0,
		},
		{
			target: 'safe_zones[6]',
			property: 'scale.x',
			keyframes: [
				{ time: 0.5, value: 0.01 },
				{ time: 1.0, value: 100 },
			],
			loop: true,
			loopDuration: 2.0,
		},
		{
			target: 'safe_zones[7]',
			property: 'scale.x',
			keyframes: [
				{ time: 0.5, value: 100 },
				{ time: 1.0, value: 0.01 },
				{ time: 1.5, value: 100 },
			],
			loop: true,
			loopDuration: 2.5,
		},
		{
			target: 'safe_zones[8]',
			property: 'scale.x',
			keyframes: [
				{ time: 1.0, value: 100 },
				{ time: 1.5, value: 0.01 },
				{ time: 2.0, value: 100 },
			],
			loop: true,
			loopDuration: 3.0,
		},
	],
} satisfies LevelData;
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: `level_1.ts` compiles cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/data/levels/level_1.ts
git commit -m "feat: add level_1 data (old Level2 — 9 safe zones, 8 animation tracks)"
```

---

### Task 12: Create `level_2.ts` — old Level3 data

**Files:**
- Create: `src/modules/core/data/levels/level_2.ts`

- [ ] **Step 1: Create the file**

All positions are offset by root (+9, +38) from `level_3.collection`. 23 safe zones in numeric ID order. All have angle=15° except `safe_zone22` (angle=0). Finish zone scaled 0.6×0.6.

```typescript
import { LevelData } from '../../types/LevelData';

export default {
	safeZones: [
		{ id: 'sz0',  x: -110.3333, y: -78.0,   width: 60,     height: 186.5999, angle: 15 },
		{ id: 'sz1',  x: -28.6666,  y: 9.0,     width: 154.4666, height: 60,    angle: 15 },
		{ id: 'sz2',  x: -13.6666,  y: 134.0,   width: 60,     height: 184.3333, angle: 15 },
		{ id: 'sz3',  x: 69.3334,   y: 221.0,   width: 146.1333, height: 60,    angle: 15 },
		{ id: 'sz4',  x: 90.3334,   y: 308.0,   width: 60,     height: 99.8,    angle: 15 },
		{ id: 'sz5',  x: -246.6666, y: 238.0,   width: 627.6667, height: 60,    angle: 15 },
		{ id: 'sz6',  x: -482.6666, y: 24.0,    width: 60,     height: 234.0667, angle: 15 },
		{ id: 'sz7',  x: -374.6666, y: -37.0,   width: 120.3333, height: 60,    angle: 15 },
		{ id: 'sz8',  x: -372.6666, y: 68.0,    width: 60,     height: 145.2,   angle: 15 },
		{ id: 'sz9',  x: -231.6666, y: 150.0,   width: 257.4667, height: 60,    angle: 15 },
		{ id: 'sz10', x: -115.6666, y: 99.0,    width: 60,     height: 98.6667, angle: 15 },
		{ id: 'sz11', x: -213.6666, y: 52.0,    width: 155.8667, height: 60,    angle: 15 },
		{ id: 'sz12', x: -210.6666, y: -139.0,  width: 60,     height: 316.0667, angle: 15 },
		{ id: 'sz13', x: 81.3334,   y: -193.0,  width: 483.9333, height: 60,    angle: 15 },
		{ id: 'sz14', x: 267.3334,  y: -74.0,   width: 60,     height: 79.4,    angle: 15 },
		{ id: 'sz15', x: 112.3334,  y: -106.0,  width: 258.4,  height: 60,      angle: 15 },
		{ id: 'sz16', x: -0.6666,   y: -67.0,   width: 60,     height: 78.0,    angle: 15 },
		{ id: 'sz17', x: 96.3334,   y: -32.0,   width: 150.2,  height: 60,      angle: 15 },
		{ id: 'sz18', x: 112.3334,  y: 81.0,    width: 60,     height: 152.9333, angle: 15 },
		{ id: 'sz19', x: 177.3334,  y: 147.0,   width: 104.4,  height: 60,      angle: 15 },
		{ id: 'sz20', x: 219.3334,  y: 76.0,    width: 60,     height: 102.0,   angle: 15 },
		{ id: 'sz21', x: 339.3334,  y: 87.0,    width: 181.2667, height: 60,    angle: 15 },
		{ id: 'sz22', x: 404.3334,  y: 21.0,    width: 60,     height: 121.8667, angle: 0 },
	],
	finishZone: { x: 404, y: -67, width: 0.6, height: 0.6, angle: 0 },
	playerPosition: { x: -94.99997, y: -133.33331 },
	shooters: [
		{ x: 466, y: 178, angle: 200, fireInterval: 0.8, bulletCount: 1 },
	],
	animations: [
		{
			target: 'shooter',
			property: 'euler.z',
			keyframes: [
				{ time: 0, value: 200 },
				{ time: 3, value: 160 },
				{ time: 6, value: 200 },
			],
			loop: true,
			loopDuration: 6,
		},
	],
} satisfies LevelData;
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: `level_2.ts` compiles cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/data/levels/level_2.ts
git commit -m "feat: add level_2 data (old Level3 — 23 safe zones, shooter oscillation)"
```

---

### Task 13: Create `level_3.ts` — old Level4 data

**Files:**
- Create: `src/modules/core/data/levels/level_3.ts`

- [ ] **Step 1: Create the file**

22 safe zones from `level_4.collection` in **alphabetical** order (how Defold indexes factory children):
`safe_zone0, safe_zone1, safe_zone10, safe_zone11, safe_zone12, safe_zone13, safe_zone14, safe_zone15, safe_zone16, safe_zone17, safe_zone18, safe_zone19, safe_zone2, safe_zone20, safe_zone21, safe_zone3, safe_zone4, safe_zone5, safe_zone6, safe_zone7, safe_zone8, safe_zone9`

Static zones (start visible at scale 60): indices **0, 7, 8, 15, 16**
= safe_zone0, safe_zone15, safe_zone16, safe_zone3, safe_zone4

Non-statics start hidden via `{time:0, value:0}` keyframe.

20 animation tracks (indices 0 and 16 have none; all other 20 have tracks).

Timing: first animation fires at t=0.5s, each step is 1s apart, tweens take 0.5s.

```typescript
import { LevelData } from '../../types/LevelData';

export default {
	safeZones: [
		{ id: 'sz0',  x: -360, y: 0,   width: 60, height: 60, angle: 0 }, // safe_zone0  idx 0 static
		{ id: 'sz1',  x: -300, y: 0,   width: 60, height: 60, angle: 0 }, // safe_zone1  idx 1
		{ id: 'sz2',  x: -60,  y: -60, width: 60, height: 60, angle: 0 }, // safe_zone10 idx 2
		{ id: 'sz3',  x: 0,    y: -60, width: 60, height: 60, angle: 0 }, // safe_zone11 idx 3
		{ id: 'sz4',  x: 60,   y: -60, width: 60, height: 60, angle: 0 }, // safe_zone12 idx 4
		{ id: 'sz5',  x: 60,   y: 0,   width: 60, height: 60, angle: 0 }, // safe_zone13 idx 5
		{ id: 'sz6',  x: 60,   y: 60,  width: 60, height: 60, angle: 0 }, // safe_zone14 idx 6
		{ id: 'sz7',  x: 120,  y: 60,  width: 60, height: 60, angle: 0 }, // safe_zone15 idx 7 static
		{ id: 'sz8',  x: 180,  y: 60,  width: 60, height: 60, angle: 0 }, // safe_zone16 idx 8 static
		{ id: 'sz9',  x: 180,  y: 0,   width: 60, height: 60, angle: 0 }, // safe_zone17 idx 9
		{ id: 'sz10', x: 180,  y: -60, width: 60, height: 60, angle: 0 }, // safe_zone18 idx 10
		{ id: 'sz11', x: 240,  y: -60, width: 60, height: 60, angle: 0 }, // safe_zone19 idx 11
		{ id: 'sz12', x: -300, y: -60, width: 60, height: 60, angle: 0 }, // safe_zone2  idx 12
		{ id: 'sz13', x: 300,  y: -60, width: 60, height: 60, angle: 0 }, // safe_zone20 idx 13
		{ id: 'sz14', x: 300,  y: 0,   width: 60, height: 60, angle: 0 }, // safe_zone21 idx 14
		{ id: 'sz15', x: -240, y: -60, width: 60, height: 60, angle: 0 }, // safe_zone3  idx 15 static
		{ id: 'sz16', x: -180, y: -60, width: 60, height: 60, angle: 0 }, // safe_zone4  idx 16 static
		{ id: 'sz17', x: -180, y: 0,   width: 60, height: 60, angle: 0 }, // safe_zone5  idx 17
		{ id: 'sz18', x: -180, y: 60,  width: 60, height: 60, angle: 0 }, // safe_zone6  idx 18
		{ id: 'sz19', x: -120, y: 60,  width: 60, height: 60, angle: 0 }, // safe_zone7  idx 19
		{ id: 'sz20', x: -60,  y: 60,  width: 60, height: 60, angle: 0 }, // safe_zone8  idx 20
		{ id: 'sz21', x: -60,  y: 0,   width: 60, height: 60, angle: 0 }, // safe_zone9  idx 21
	],
	finishZone: { x: 360, y: 0, width: 0.6, height: 0.6, angle: 0 },
	playerPosition: { x: -360, y: 0 },
	shooters: [],
	animations: [
		// idx 1: show t=0.5, hide t=2.5
		{
			target: 'safe_zones[1]',
			property: 'scale',
			keyframes: [
				{ time: 0,   value: 0  },
				{ time: 0.5, value: 0  },
				{ time: 1.0, value: 60 },
				{ time: 2.5, value: 60 },
				{ time: 3.0, value: 0  },
			],
			loop: false,
		},
		// idx 2: show t=1.5, hide t=4.5
		{
			target: 'safe_zones[2]',
			property: 'scale',
			keyframes: [
				{ time: 0,   value: 0  },
				{ time: 1.5, value: 0  },
				{ time: 2.0, value: 60 },
				{ time: 4.5, value: 60 },
				{ time: 5.0, value: 0  },
			],
			loop: false,
		},
		// idx 3: show t=1.5, hide t=8.5
		{
			target: 'safe_zones[3]',
			property: 'scale',
			keyframes: [
				{ time: 0,   value: 0  },
				{ time: 1.5, value: 0  },
				{ time: 2.0, value: 60 },
				{ time: 8.5, value: 60 },
				{ time: 9.0, value: 0  },
			],
			loop: false,
		},
		// idx 4: show t=3.5, hide t=6.5
		{
			target: 'safe_zones[4]',
			property: 'scale',
			keyframes: [
				{ time: 0,   value: 0  },
				{ time: 3.5, value: 0  },
				{ time: 4.0, value: 60 },
				{ time: 6.5, value: 60 },
				{ time: 7.0, value: 0  },
			],
			loop: false,
		},
		// idx 5: show t=5.5, stays visible
		{
			target: 'safe_zones[5]',
			property: 'scale',
			keyframes: [
				{ time: 0,   value: 0  },
				{ time: 5.5, value: 0  },
				{ time: 6.0, value: 60 },
			],
			loop: false,
		},
		// idx 6: show t=5.5, hide t=16.5
		{
			target: 'safe_zones[6]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 5.5,  value: 0  },
				{ time: 6.0,  value: 60 },
				{ time: 16.5, value: 60 },
				{ time: 17.0, value: 0  },
			],
			loop: false,
		},
		// idx 7 (static, starts 60): hide t=11.5
		{
			target: 'safe_zones[7]',
			property: 'scale',
			keyframes: [
				{ time: 11.5, value: 60 },
				{ time: 12.0, value: 0  },
			],
			loop: false,
		},
		// idx 8 (static, starts 60): hide t=13.5
		{
			target: 'safe_zones[8]',
			property: 'scale',
			keyframes: [
				{ time: 13.5, value: 60 },
				{ time: 14.0, value: 0  },
			],
			loop: false,
		},
		// idx 9: show t=9.5, stays visible
		{
			target: 'safe_zones[9]',
			property: 'scale',
			keyframes: [
				{ time: 0,   value: 0  },
				{ time: 9.5, value: 0  },
				{ time: 10.0, value: 60 },
			],
			loop: false,
		},
		// idx 10: show t=10.5, hide t=15.5
		{
			target: 'safe_zones[10]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 10.5, value: 0  },
				{ time: 11.0, value: 60 },
				{ time: 15.5, value: 60 },
				{ time: 16.0, value: 0  },
			],
			loop: false,
		},
		// idx 11: show t=12.5, hide t=18.5
		{
			target: 'safe_zones[11]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 12.5, value: 0  },
				{ time: 13.0, value: 60 },
				{ time: 18.5, value: 60 },
				{ time: 19.0, value: 0  },
			],
			loop: false,
		},
		// idx 12: show t=14.5, hide t=22.5
		{
			target: 'safe_zones[12]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 14.5, value: 0  },
				{ time: 15.0, value: 60 },
				{ time: 22.5, value: 60 },
				{ time: 23.0, value: 0  },
			],
			loop: false,
		},
		// idx 13: show t=14.5, stays visible
		{
			target: 'safe_zones[13]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 14.5, value: 0  },
				{ time: 15.0, value: 60 },
			],
			loop: false,
		},
		// idx 14: show t=17.5, hide t=20.5
		{
			target: 'safe_zones[14]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 17.5, value: 0  },
				{ time: 18.0, value: 60 },
				{ time: 20.5, value: 60 },
				{ time: 21.0, value: 0  },
			],
			loop: false,
		},
		// idx 15 (static, starts 60): hide t=24.5
		{
			target: 'safe_zones[15]',
			property: 'scale',
			keyframes: [
				{ time: 24.5, value: 60 },
				{ time: 25.0, value: 0  },
			],
			loop: false,
		},
		// idx 17: show t=21.5, hide t=26.5
		{
			target: 'safe_zones[17]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 21.5, value: 0  },
				{ time: 22.0, value: 60 },
				{ time: 26.5, value: 60 },
				{ time: 27.0, value: 0  },
			],
			loop: false,
		},
		// idx 18: show t=23.5, hide t=28.5
		{
			target: 'safe_zones[18]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 23.5, value: 0  },
				{ time: 24.0, value: 60 },
				{ time: 28.5, value: 60 },
				{ time: 29.0, value: 0  },
			],
			loop: false,
		},
		// idx 19: show t=23.5, stays visible
		{
			target: 'safe_zones[19]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 23.5, value: 0  },
				{ time: 24.0, value: 60 },
			],
			loop: false,
		},
		// idx 20: show t=25.5, stays visible
		{
			target: 'safe_zones[20]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 25.5, value: 0  },
				{ time: 26.0, value: 60 },
			],
			loop: false,
		},
		// idx 21: show t=27.5, stays visible
		{
			target: 'safe_zones[21]',
			property: 'scale',
			keyframes: [
				{ time: 0,    value: 0  },
				{ time: 27.5, value: 0  },
				{ time: 28.0, value: 60 },
			],
			loop: false,
		},
	],
} satisfies LevelData;
```

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: `level_3.ts` compiles cleanly.

- [ ] **Step 3: Commit**

```bash
git add src/modules/core/data/levels/level_3.ts
git commit -m "feat: add level_3 data (old Level4 — 22 safe zones alphabetical, 20 animation tracks)"
```

---

### Task 14: Update `data/levels.ts` and delete old files

**Files:**
- Modify: `src/modules/core/data/levels.ts`
- Delete: `src/modules/core/levels/Level1.ts`
- Delete: `src/modules/core/levels/Level2.ts`
- Delete: `src/modules/core/levels/Level3.ts`
- Delete: `src/modules/core/levels/Level4.ts`
- Delete: `src/modules/core/levels/levels.ts`

- [ ] **Step 1: Update `data/levels.ts`**

```typescript
import level_0 from './levels/level_0';
import level_1 from './levels/level_1';
import level_2 from './levels/level_2';
import level_3 from './levels/level_3';

export const levels = [level_0, level_1, level_2, level_3];
```

- [ ] **Step 2: Delete old level files**

```bash
git rm src/modules/core/levels/Level1.ts
git rm src/modules/core/levels/Level2.ts
git rm src/modules/core/levels/Level3.ts
git rm src/modules/core/levels/Level4.ts
git rm src/modules/core/levels/levels.ts
```

- [ ] **Step 3: Run build — expect clean**

Run: `npm run build`
Expected: **0 errors**. Full clean build.

- [ ] **Step 4: Commit**

```bash
git add src/modules/core/data/levels.ts
git commit -m "feat: complete data-driven levels — export all 4 levels, delete old Level1-4 classes"
```

---

### Task 15: Defold Editor — add missing objects to `level.collection`

> This task requires manual work in Defold Editor. Cannot be automated.

- [ ] Open `app/main/core/level.collection` in Defold Editor
- [ ] Add an embedded instance named `root` as parent of all other objects in the collection
- [ ] Add a game object named `shooter` as a child of `root`
- [ ] Add an embedded instance named `bullets` with a `factory` component (prototype: `/main/core/bullet.go`) as a child of `root`
- [ ] Verify the collection hierarchy matches `levelSchema`: `root`, `finish_zone`, `player`, `player_center`, `player_edges` (list), `cursor`, `safe_zones` (with factory), `shooter`, `bullets` (with factory)
- [ ] Save and close

---

## Notes for Defold Editor

The `level.collection` file needs `root`, `shooter`, and `bullets` added before the game can run. The TypeScript build will succeed without these, but runtime will fail. See Task 15.
