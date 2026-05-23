# Constitution

Authoritative specification for this project. All development — human or AI-assisted — must follow these rules.

---

## 1. Source of Truth

- **All game logic is written in TypeScript** inside `src/`. Lua is an output format, not a development language.
- `app/modules/` and `app/scripts/` contain **generated Lua** produced by `tstl` from `src/`. **Never edit these files directly** — any manual change will be silently overwritten on the next build.
- The only hand-maintained files under `app/` are assets and Defold project files (`.collection`, `.go`, `.script`, `.gui`, `.atlas`, `game.project`, etc.).
- Game design intent and mechanic vocabulary live in `docs/specs/` — start with [`docs/specs/README.md`](docs/specs/README.md).
- **Spec-first rule:** before adding a new mechanic or a boss level, write (or update) the relevant spec in `docs/specs/` and commit it. Regular levels are defined as JSON via the level editor — no markdown spec needed.

---

## 2. Build Pipeline

```
src/**/*.ts  →  tstl (TypeScript-to-Lua)  →  app/modules/ + app/scripts/  →  Defold Bob  →  game binary
```

- `npm run build` — one-shot TypeScript → Lua compilation.
- `npm run dev` — watch mode; use during active development.
- `npm run lint` — ESLint; must pass before any commit.
- `npm run prettier` — format `.ts`, `.json`, `.yml`, `.md` files.

---

## 3. Code Style & Language Rules

These rules are enforced by ESLint (`eslint.config.mjs`) and TypeScript strict mode.

### 3.1 `undefined` instead of `null`
Use `undefined` everywhere. `null` is banned (ESLint `no-restricted-types`).

**Why:** In Lua there is only `nil`. `null` compiles to a value that has no Lua equivalent and causes runtime surprises.

### 3.2 Strict boolean expressions
Never rely on implicit truthiness of strings or numbers in conditions.

```ts
// Wrong
if (name) { ... }
if (count) { ... }

// Correct
if (name !== undefined) { ... }
if (count > 0) { ... }
```

**Why:** ESLint `strict-boolean-expressions` rule. Lua and TypeScript truthiness semantics differ.

### 3.3 Unused variables
Prefix with `_` to suppress the lint error (e.g., `_dt`, `_event`). Do not delete parameter slots from interface-required signatures.

### 3.4 Strict equality
Always use `===` / `!==`. ESLint `eqeqeq` rule forbids `==` / `!=`.

---

## 4. Architecture Rules

### 4.1 Controllers are the unit of game logic

All stateful game logic must live in a class extending `Controller` (`src/modules/engine/Controller.ts`). Controllers implement lifecycle hooks:

| Method | When called |
|--------|-------------|
| `init()` (constructor) | Once on load |
| `update(dt)` | Every frame |
| `lateUpdate(dt)` | Every frame, after update |
| `fixedUpdate(dt)` | Physics tick (60 Hz) |
| `onInput(actionId, action)` | On player input |
| `onResize()` | On screen resize |
| `final()` | On unload / cleanup |

Never call Defold APIs (`go.*`, `msg.*`, `physics.*`, etc.) from outside a Controller or its owned helpers.

### 4.2 Scripts are thin bridges only

Files in `src/scripts/` (compiled to `.script` / `.gui_script` / `.render_script`) must contain **no game logic**. Their sole responsibility is to receive Defold lifecycle callbacks and delegate them to the corresponding Controller via `Messenger`.

```ts
// Correct — pure delegation
export function update(this: Self, dt: number) {
    this.controller.update(dt);
}
```

### 4.3 Type-safe layouts — never raw URL strings

Every collection must have a layout schema in `src/modules/layouts/`. Access game objects and components through the typed layout, not through raw Defold URL strings or `go.get_id()`.

```ts
// Wrong
const pos = go.get_position('/player');

// Correct — use the typed layout
const pos = this.layout.player.getPosition();
```

Define schemas with the `satisfies CollectionSchema` pattern and derive the layout type from it:

```ts
export const mySchema = { ... } satisfies CollectionSchema;
export type MyLayout = CollectionLayout<typeof mySchema>;
```

### 4.4 Messenger for script ↔ controller communication

Controllers communicate with `.script` files through `Messenger`. Use the defined `MessageId` enum values — do not introduce bare string message IDs.

- `ScriptBridgeCall` — invoke a controller method by name.
- `ScriptBridgeEvent` — controller emits an event to the script.
- `ScriptBridgeConnect` / `ScriptBridgeDisconnect` — subscribe/unsubscribe a script to all signals on a controller.

### 4.5 Signals for typed pub/sub within TypeScript

Use `Signal<T>` for intra-TypeScript events. Expose public signals on Controllers as named properties so that `ScriptBridgeConnect` can forward them automatically.

```ts
// Declaration on controller
public onRestart = new Signal();

// Subscription elsewhere
coreController.onRestart.add(() => { ... });
```

Always call `binding.destroy()` during cleanup to prevent leaks.

### 4.6 Physics via PhysicsEventDistributor

- Call `this.enablePhysics()` inside the Controller that owns the physics world (currently `CoreController`). Do not call `physics.set_event_listener` directly.
- Register game objects that need collision callbacks with `GameObjectRegister` so the distributor can route events to them.
- Physics component properties on `GameObject` are lazy-initialized; access them only after physics is enabled.

### 4.7 Persistent storage via `Storage<T>`

Use `Storage<T>` (`src/modules/engine/Storage.ts`) for any data that must survive between sessions. Instantiate a single module-level instance and import it where needed (see `src/modules/services/Storage.ts`).

```ts
// Save a partial patch — unchanged keys are preserved
storage.save({ levelNumber: 2 });
```

---

## 5. File & Module Layout

```
src/
  modules/
    engine/       # Reusable engine primitives (Controller, Signal, Messenger,
                  #   GameObject, layouts, physics, timeline, render)
    core/         # Game-specific controllers and entities
    layouts/      # CollectionSchema definitions for each collection
    enums/        # Shared enums (ControllerName, PopupName, PhysicsGroup)
    popups/       # Popup controllers
    animations/   # Reusable animation helpers
    services/     # Singleton service instances (e.g., Storage)
  scripts/        # Defold lifecycle bridges (.script / .gui_script)
```

- `src/modules/engine/` is the framework layer. It must not import from `src/modules/core/` or game-specific code.
- New game features belong in `src/modules/core/` or a dedicated sibling directory, not in `engine/`.
- Each collection that has a Controller must have a corresponding layout schema in `src/modules/layouts/`.

---

## 6. Defold-Specific Constraints

- Target runtime: **Lua 5.1** (set in `tsconfig.json` `tstl.luaTarget`).
- TypeScript features that have no Lua equivalent are forbidden: `null`, generators, `Symbol`, `WeakMap`/`WeakSet`.
- Use `@ts-defold/types` for Defold API types — do not write raw `any` casts for engine calls.
- `.script` files use the `tstl-export-to-global` plugin; all exported functions become Lua globals as required by Defold.
