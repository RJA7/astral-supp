# Spec-Driven Development Design

**Date:** 2026-05-23  
**Status:** Approved

## Goal

Make the project spec-driven so that:
- Design intent is captured before implementation begins
- AI sessions can restore full game context quickly by reading a small set of documents
- The specs remain the permanent record of design decisions

## File Structure

```
docs/
  specs/
    README.md       — entry point: game concept summary + links to mechanics
    mechanics.md    — all core mechanics (vocabulary the level editor will use)
```

`constitution.md` and `CLAUDE.md` both reference `docs/specs/README.md` as the game design entry point.

## What Lives Where

**`README.md`** — One paragraph on the game concept, then a table of contents linking to mechanics and any future spec files (boss levels, level editor, etc.). Purpose: an AI session reads this first and gets the full picture in one pass.

**`mechanics.md`** — One section per mechanic. Each section contains:
- A one-paragraph description of what the mechanic does and why it exists
- Key parameters (values visible at the game-design level)
- How it interacts with other mechanics

No implementation details. Pure design intent.

**Level data** — Levels are not spec'd in markdown. Regular levels will be defined as JSON produced by the level editor. Boss levels will each get their own spec file in `docs/specs/` when designed.

## Mechanics Scope

Core mechanics to document in the initial `mechanics.md`:

| Mechanic | Description |
|---|---|
| Safe zone | Platforms (rectangular by default, circular as variant) the player must stay on; can appear, disappear, or scale in/out via timeline |
| Bullets | Projectiles fired from a rotating shooter; destroyed on contact with player or wall |
| Slow-down trigger | One-time physics trigger that permanently halves game time scale |
| Player HP | Starts at 100; decremented on hazard contact; reaching 0 triggers game-over |
| Player movement | Physics-driven follow-the-cursor; momentum preserved between frames |

## Workflow

1. **New mechanic** → add a section to `mechanics.md` before writing any code
2. **New regular level** → define in JSON via level editor; no markdown spec needed
3. **New boss level** → create `docs/specs/level-boss-<name>.md` before implementation
4. **Level editor** → create `docs/specs/level-editor.md` before implementation begins

## Context Restoration Path

For a new AI session working on this project:

1. Read `CLAUDE.md` — architecture and commands
2. Read `constitution.md` — development rules
3. Read `docs/specs/README.md` — game concept and links
4. Read `docs/specs/mechanics.md` — full mechanic vocabulary
