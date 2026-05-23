# Data-Driven Levels Design

**Date:** 2026-05-23  
**Status:** Approved

## Overview

Replace the per-level TypeScript classes (Level1–4) and embedded Defold collection data with a fully data-driven level system. All level layout, mechanics, and animations are defined in TypeScript data files (typed JSON-like objects). A single generic `Level` class executes any level from its data.

---

## Goals

- Level content (safe zones, finish zone, player position, shooters, animations) lives in data files
- New levels require no TypeScript code changes — only a new data file
- Animations are keyframe-based timelines: each keyframe defines a time and target value; the system lerps from the current value to each point in sequence
- Shooter mechanics (firing rate, bullet count, spread) are parameterised from data
- All levels use a single reusable `level.collection` Defold template

---

## Architecture

### Data Flow

```
data/levels/level_N.ts
       ↓
CoreLevel.startLevel(n)
  → createLevelLayout()        // instantiates level.collection
  → spawn safe zones from data // layout.safe_zones.factory
  → position player/finish     // from levelData
  → new Level(layout, safeZones, levelData)
       ↓
Level.start()
  → runAnimations(levelData.animations)
  → setupShooters(levelData.shooters)
```

### Defold Collection

All levels use a single `app/main/core/level.collection` template. It contains:
- `root` — parent embedded instance; all other objects are children
- `player` (with `player_center`, `player_edge0–3` children)
- `cursor`
- `outline`
- `finish_zone`
- `safe_zones` — embedded instance with a `factory` component
- `shooter` — game object for shooting levels
- `bullets` — embedded instance with a `factory` component

> **Action required:** Add `root`, `shooter`, and `bullets` to `level.collection` in Defold Editor.

---

## Type Definitions

### `LevelData`

```typescript
type LevelData = {
  safeZones: SafeZoneData[];
  finishZone: FinishZoneData;
  playerPosition: PointData;
  shooters: ShooterData[];
  animations: AnimationTrack[];
};
```

### `AnimationTrack`

```typescript
type AnimationTrack = {
  target: string;       // "safe_zones[0]", "shooter", "finish_zone"
  property: string;     // "scale" | "scale.x" | "scale.y" | "position.x" | "position.y" | "euler.z"
  keyframes: AnimationKeyframe[];
  loop?: boolean;
  loopDuration?: number; // full cycle length in seconds; required when loop=true and final keyframe time < cycle end
};

type AnimationKeyframe = {
  time: number;   // seconds from track start
  value: number;  // property lerps FROM current value TO this value by this time
};
```

**Property shorthands:**  
- `"scale"` — sets both `scale.x` and `scale.y` to the same value in one track

**Keyframe semantics:**  
Each consecutive pair of keyframes defines a tween segment: duration = `keyframe[i].time - keyframe[i-1].time`, from = previous value (or current object state for the first segment), to = `keyframe[i].value`. A keyframe at `time: 0` sets the initial state immediately without lerping.

### `ShooterData`

```typescript
type ShooterData = {
  x: number;
  y: number;
  angle: number;          // initial euler Z in degrees
  shorRate: number;       // fire interval in seconds
  bulletCount?: number;   // default 1
  bulletSpread?: number;  // degrees between bullets; default 0
};
```

### Other types (unchanged)

`SafeZoneData`, `FinishZoneData`, `RectZoneData`, `PointData` — no changes.

> **Semantics note:** `SafeZoneData.width/height` are pixel-scale dimensions (e.g. 60 = 60px), set directly as `scale3`. `FinishZoneData.width/height` are proportional scale factors (e.g. 0.6 or 1.0), reflecting the collection's `scale3` values. `CoreLevel` sets both via `setScale2D` but the numeric ranges differ.

---

## Level Layout Schema (`LevelLayout.ts`)

Add `finish_zone`, `shooter`, and `bullets` to `levelSchema`:

```typescript
export const levelSchema = {
  root: {},
  finish_zone: {},
  player: {},
  player_center: {},
  player_edges: list({}),
  cursor: { sprite: Sprite },
  safe_zones: { factory: Factory },
  shooter: {},
  bullets: { factory: Factory },
} satisfies CollectionSchema;
```

---

## `CoreLevel.ts`

`CoreLevel.startLevel(n)`:
1. Load `levelData = levels[n]` from data array
2. Call `createLevelLayout(level_factory)` — always loads `level.collectionc`
3. Create safe zones: for each `SafeZoneData`, call `layout.safe_zones.factory.create(safeZoneSchema)`, set position/scale/angle, call `syncSafeZoneCollider`
4. Position `layout.player` and `layout.cursor` from `levelData.playerPosition`
5. Position and scale `layout.finish_zone` from `levelData.finishZone`
6. Call `physics.setLayout(layout)` to wire collision handlers
7. Instantiate `new Level({ layout, safeZones, levelData })`, call `level.start()`
8. Return `{ player: new Player(layout.player), cursor: new Cursor(layout.cursor) }`

`destroyCurrentLevel()`: call `level.destroy()`, then `level.layout.root.delete()`.

---

## `CreateLevelLayout.ts`

Simplified — always loads the same collection, no level number:

```typescript
export function createLevelLayout(level_factory: CollectionFactory) {
  level_factory.setPrototype('/main/core/level.collectionc');
  return level_factory.createLayout(levelSchema);
}
```

---

## Generic `Level.ts`

Replaces `Level1.ts`, `Level2.ts`, `Level3.ts`, `Level4.ts`.

```typescript
class Level {
  public readonly layout: LevelLayout;  // used by CoreLevel.destroyCurrentLevel

  constructor(props: LevelProps) { ... }

  async start() {
    this.runAnimations(this.levelData.animations);
    for (const s of this.levelData.shooters) this.setupShooter(s);
  }

  destroy() { this.timeline.destroy(); }
}
```

### Animation system

`runAnimations(tracks)`:
- For each track, resolve `track.target` to a game object:
  - `"safe_zones[n]"` → `safeZones[n]`
  - `"shooter"` → `layout.shooter`
  - `"finish_zone"` → `layout.finish_zone`
- Parse `track.property` into group + axis (e.g. `"scale.x"` → group `"scale"`, axis `"x"`; `"scale"` → group `"scale"`, both axes)
- Schedule tween segments on `Timeline`: for each pair of consecutive keyframes, `timeline.tween(obj, group, { axis: value }, duration)`
- For safe zone targets: attach `.onUpdate(syncSafeZoneTweenCollider)` to every scale-changing tween so the physics collider stays in sync with the visual
- If `loop: true`, wrap in `timeline.loop(loopDuration, ...)` or equivalent repeat. If `loopDuration > lastKeyframe.time`, the system waits the remaining gap before restarting

### Shooter mechanics

`setupShooter(data: ShooterData)`:
- Set `layout.shooter` position and initial euler from data
- `timeline.loop(data.shorRate, () => { /* spawn bullets */ })`
- Spawn `data.bulletCount ?? 1` bullets, each offset by `data.bulletSpread ?? 0` degrees from shooter angle
- Each bullet: `layout.bullets.factory.create(bulletSchema)`, animate to distance, set up wall/player collision handler to delete

---

## `CorePhysics.ts`

- Constructor: takes only `CoreState` (no layout)
- Add `setLayout(layout: LevelLayout)`: registers physics handlers for `player`, `player_center`, `player_edges`; stores `player_center.id` for `dispatchSignals`
- `onLevelChanged()`: clears `isSafeById`

---

## `CoreController.ts`

- Remove `player: Player` and `cursor: Cursor` as constructor-time fields
- `startLevel(n)` calls `this.level.startLevel(n)` which returns `{ player, cursor }`; store on instance
- `update()` and `fixedUpdate()` use `this.player` / `this.cursor` (guard: only call after first `startLevel`)
- `physics` constructed before `level`: `new CorePhysics(state)`, passed to `CoreLevel`

---

## Level Registry Changes

`src/modules/core/levels/levels.ts` is deleted. `LevelProps` moves to `Level.ts`:

```typescript
export type LevelProps = {
  layout: LevelLayout;
  safeZones: SafeZoneLayout[];
  levelData: LevelData;
};
```

`CoreController` checks if next level exists using the data array length: `if (n < levels.length)`.

---

## `Storage.ts`

- Default `levelNumber` changes from `1` to `0`
- Remove the debug line `storage.data.levelNumber = 4`
- `CoreController.onResetClick` saves `{ levelNumber: 0 }`

---

## Data Files

Level numbering shifts: new index 0 = old Level1, new index 1 = old Level2, etc.

### `src/modules/core/data/levels.ts`

```typescript
export const levels = [level_0, level_1, level_2, level_3];
```

### `level_0.ts` (old Level1 / level_1.collection)

Safe zones from `level_1.collection` positions/scales. Root at (0,0) — no offset.  
Player position: `(-1, 168.67)`.  
Finish zone: `(-245, -119)`.  
Shooter: `{ x: -1, y: -37, angle: 0, shorRate: 0.5, bulletCount: 3, bulletSpread: 120 }`.  
Animations: one track — shooter full 360° rotation over 6s, loop.

### `level_1.ts` (old Level2 / level_2.collection)

Safe zones from `level_2.collection`. No shooter.  
Player position: `(-478, -271.33)`.  
Finish zone: `(465, -250)`.  
Animations: tracks for safe_zones[1]–[8] scale/position tweens (yoyo via mirrored keyframes).

### `level_2.ts` (old Level3 / level_3.collection)

All positions offset by root `(9, 38)`.  
Safe zones: all 23 zones, angle = 15° (quaternion z:0.13052619 w:0.9914449).  
Player position: `(-95, -133.33)` (raw `(-104, -171.33)` + offset).  
Finish zone: `(404, -67)`.  
Shooter: `{ x: 466, y: 178, angle: 200, shorRate: 0.8, bulletCount: 1 }`.  
Animations: one track — shooter oscillates 200°→160°→200°, 3s per half, loop.

### `level_3.ts` (old Level4 / level_4.collection)

22 safe zones. No shooter.  
Player position: `(-360, 0)`.  
Finish zone: `(360, 0)`.  
Static zones (always visible): indices [0, 7, 8, 15, 16].  
Non-static zones start hidden: animation tracks begin with `{ time: 0, value: 0 }`.  
Animations: one track per non-static zone, keyframes per the 24-step show/hide sequence (~29s cycle), all looped with `loopDuration: 29`.

---

## Dropped Features

- `slow_down_trigger` (Level1): no equivalent in `level.collection`. Dropped.
- Per-level TypeScript animation code: fully replaced by data.

---

## Files Changed

| File | Action |
|------|--------|
| `src/modules/core/types/LevelData.ts` | Add `AnimationTrack`, `AnimationKeyframe`; extend `ShooterData` |
| `src/modules/layouts/LevelLayout.ts` | Add `finish_zone`, `shooter`, `bullets` to schema |
| `src/modules/core/helpers/CreateLevelLayout.ts` | Always load `level.collectionc` |
| `src/modules/core/CoreLevel.ts` | Full rework |
| `src/modules/core/CoreController.ts` | Player/cursor per-level; physics init order |
| `src/modules/core/CorePhysics.ts` | `setLayout` method; remove CoreLayout dep |
| `src/modules/core/levels/Level.ts` | New generic level runner |
| `src/modules/core/levels/Level1–4.ts` | Deleted |
| `src/modules/core/levels/levels.ts` | Deleted |
| `src/modules/core/data/levels.ts` | Export all 4 level data objects |
| `src/modules/core/data/levels/level_0.ts` | Fill with old Level1 data |
| `src/modules/core/data/levels/level_1.ts` | New — old Level2 data |
| `src/modules/core/data/levels/level_2.ts` | New — old Level3 data (+ root offset) |
| `src/modules/core/data/levels/level_3.ts` | New — old Level4 data |
| `src/modules/services/Storage.ts` | Default `levelNumber: 0`; remove debug line |
| `app/main/core/level.collection` | Add `root`, `shooter`, `bullets` *(Defold Editor)* |
