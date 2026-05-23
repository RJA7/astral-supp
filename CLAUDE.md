# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See [constitution.md](constitution.md) for the authoritative development rules and architecture spec.

## Project Overview

A Defold game written in TypeScript, compiled to Lua via [TypeScript-to-Lua (tstl)](https://typescripttolua.github.io/). Source lives in `src/`, compiled Lua output goes to `app/modules/` and `app/scripts/`.

## Commands

```bash
npm run build      # Compile TypeScript → Lua (one-shot)
npm run dev        # Watch mode compilation
npm run lint       # ESLint on src/
npm run prettier   # Format .ts, .json, .yml, .md files
npm run resolve    # Re-fetch @ts-defold library definitions
```

There is no test framework. The game runs inside the Defold engine; runtime testing requires opening `app/game.project` in Defold Editor.

## Architecture

### TypeScript → Lua Pipeline

TypeScript is transpiled to Lua 5.1 by `tstl`. The `tsconfig.json` sets `rootDir: src/` and `outDir: app/`. Never edit files under `app/modules/` or `app/scripts/` directly — they are generated. The Defold build (via Bob) then compiles the Lua + assets into the final game.

### Controller System

All game logic lives in **Controllers** that extend `Controller` (base class at `src/modules/engine/Controller.ts`). Controllers implement a lifecycle:

- `init()` — setup
- `update(dt)` / `lateUpdate(dt)` — per-frame
- `fixedUpdate(dt)` — physics tick (60 Hz)
- `onInput(actionId, action)` — input
- `final()` — cleanup

Defold `.script` files (in `src/scripts/`) act as thin bridges that delegate to controllers via the **Messenger**. The top-level `MainController` loads `CoreController` through a `CollectionProxy`.

### Messenger & Signals

- **Messenger** — routes typed messages between Defold scripts and controllers. Scripts communicate with controllers via built-in message types: `ScriptBridgeCall`, `ScriptBridgeEvent`, `ScriptBridgeConnect`.
- **Signal** — pub/sub within TypeScript. Controllers expose typed signals (e.g., `CoreController.onRestart`) that other controllers or scripts subscribe to.

### Layout System

Collections and game object hierarchies are declared as schemas using `createCollectionLayout()`. This generates type-safe accessors instead of raw string URLs.

- `src/layouts/` — layout schemas for each collection (`CoreLayout`, `MainLayout`, etc.)
- Access components via the typed layout object, never via raw Defold URL strings.

### Entity & Component Wrappers

`GameObject` (`src/modules/engine/GameObject.ts`) wraps Defold game objects with a typed API for position, rotation, scale, animation, and physics. Component wrappers live in `src/modules/engine/components/` (Sprite, RigidBody, Factory, GuiNode, SpineModel, Script).

### Physics

`PhysicsEventDistributor` listens to Defold's physics engine and routes collision/trigger events to registered `GameObject` instances. Physics components are lazy-initialized on first access.

### Services

`Storage<T>` (`src/modules/services/Storage.ts`) is a generic persistent key-value store wrapping Defold's `sys.save`/`sys.load`. Used for level progress via `src/services/`.

## Key Conventions

- **`undefined` instead of `null`** — enforced by ESLint (`no-null` rule) for Lua compatibility.
- **Strict booleans** — no implicit boolean coercion (`strict-boolean-expressions` rule).
- **Unused variables** — prefix with `_` to suppress the lint rule.
- **Output path** — `app/` mirrors `src/` structure. A file at `src/modules/foo/Bar.ts` compiles to `app/modules/foo/Bar.lua`.
