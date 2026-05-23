# Spec-Driven Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the `docs/specs/` entry point and mechanics reference doc, then wire both `CLAUDE.md` and `constitution.md` to point to them.

**Architecture:** Two new markdown files (`README.md` as the fast-path entry point, `mechanics.md` as the mechanic vocabulary reference) plus two one-line additions to existing docs. No code changes.

**Tech Stack:** Markdown, Git

---

### Task 1: Create `docs/specs/README.md`

**Files:**
- Create: `docs/specs/README.md`

- [ ] **Step 1: Create the file with the following exact content**

```markdown
# Game Design Specs

## Concept

A physics-based survival game. The player controls a character that moves by following the cursor. The world consists of safe zones — platforms the player must stay on. Safe zones appear and disappear over time, creating urgency. Hazards (bullets, void) deal HP damage. Reaching 0 HP triggers a game-over. Completing the level's objective triggers a win.

Levels increase in complexity by combining more mechanics and tighter timing windows.

## Contents

- [mechanics.md](mechanics.md) — all core mechanics: safe zones, bullets, slow-down trigger, player HP, player movement

## Future Specs

| Topic | File | Status |
|---|---|---|
| Level editor | `level-editor.md` | not started |
| Boss levels | `level-boss-<name>.md` per boss | not started |
```

- [ ] **Step 2: Verify the file exists and reads correctly**

Open `docs/specs/README.md` and confirm all links and table render correctly (no broken markdown).

- [ ] **Step 3: Commit**

```bash
git add docs/specs/README.md
git commit -m "Add docs/specs/README.md — game design entry point"
```

---

### Task 2: Create `docs/specs/mechanics.md`

**Files:**
- Create: `docs/specs/mechanics.md`

- [ ] **Step 1: Create the file with the following exact content**

```markdown
# Core Mechanics

---

## Safe Zone

**What it is:** A platform the player must stay on to survive. Leaving all safe zones causes continuous HP damage.

**Shape:** Rectangular by default. Circular as a variant where the level design calls for it.

**Behaviour:**
- Safe zones can be static (present for the entire level) or dynamic (appear and disappear on a timeline).
- Scale-in / scale-out animations signal an upcoming appearance or removal, giving the player a reaction window.
- Multiple safe zones can be active at the same time, forming chains the player navigates between.

**Key parameters:**
- Scale: `0` = invisible / no collision, `60` = standard platform size (in world units)
- Tween duration for scale transitions: typically `0.5s`

**Interacts with:** Player movement (must stay on), Player HP (damage when off).

---

## Bullets

**What it is:** Projectiles fired periodically from a rotating shooter object. They travel in a straight line and are destroyed on contact with the player or a wall.

**Behaviour:**
- The shooter rotates continuously on a timeline. Bullets are spawned at fixed angular offsets (e.g., 0°, 120°, 240° for a triple shot).
- Each bullet travels toward a distant target point along the shooter's aim direction.
- Bullets are pooled via a factory; each is destroyed when it hits a wall or the player.

**Key parameters:**
- Fire interval: `0.5s`
- Number of simultaneous bullet directions: typically 3
- Travel distance before auto-destroy: `1000` world units
- Shooter rotation period: `6s` per full revolution

**Interacts with:** Player HP (damage on contact), Safe zone walls (bullet destroyed on contact).

---

## Slow-Down Trigger

**What it is:** A one-time invisible physics trigger. When the player steps on it, the entire game time scale is permanently halved for the rest of the level.

**Behaviour:**
- Activates exactly once — the trigger object is deleted immediately on first contact.
- Affects all timeline-driven animations and timers (bullets, safe zone tweens, etc.) because they all run through the shared `Timeline` time scale.
- Not reversible within a level; resetting the level restores normal speed.

**Key parameters:**
- Time scale after activation: `0.5` (half speed)

**Interacts with:** All timeline-driven mechanics (bullet fire rate, safe zone transitions slow proportionally).

---

## Player HP

**What it is:** A numeric health value representing how close the player is to game-over.

**Behaviour:**
- Starts at `100` at the beginning of each level run.
- Decremented when the player contacts a hazard (bullet, void / off all safe zones).
- Reaching `0` sets `gameOver = true` and shows the restart popup (lose state).
- Displayed in the HUD; updates in real time via the `onPlayerHpChanged` signal.

**Key parameters:**
- Starting value: `100`
- Game-over threshold: `0`

**Interacts with:** Bullets (damage source), Safe zone (damage when off all zones), HUD (display), Restart popup (trigger on 0).

---

## Player Movement

**What it is:** The player character moves by following the cursor position using physics simulation.

**Behaviour:**
- The player applies force toward the cursor each physics tick (`fixedUpdate` at 60 Hz).
- Momentum is preserved — the player slides and overshoots on fast inputs.
- The cursor position is clamped or guided so it stays meaningful on resize.
- Mouse lock can be toggled (e.g., locked during gameplay, released on game-over).

**Key parameters:**
- Physics tick rate: `60 Hz`

**Interacts with:** Safe zone (player must stay on them), Bullets (player must dodge), Cursor (input source).
```

- [ ] **Step 2: Verify the file reads correctly**

Open `docs/specs/mechanics.md` and confirm each section heading is present: Safe Zone, Bullets, Slow-Down Trigger, Player HP, Player Movement.

- [ ] **Step 3: Commit**

```bash
git add docs/specs/mechanics.md
git commit -m "Add docs/specs/mechanics.md — core mechanic vocabulary"
```

---

### Task 3: Wire `constitution.md` and `CLAUDE.md` to the specs

**Files:**
- Modify: `constitution.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add game design reference and spec-first workflow rule to `constitution.md`**

In `constitution.md`, find the existing `## 1. Source of Truth` section. Add these two lines at the end of that section:

```markdown
- Game design intent and mechanic vocabulary live in `docs/specs/` — start with [`docs/specs/README.md`](docs/specs/README.md).
- **Spec-first rule:** before adding a new mechanic or a boss level, write (or update) the relevant spec in `docs/specs/` and commit it. Regular levels are defined as JSON via the level editor — no markdown spec needed.
```

- [ ] **Step 2: Add game design reference to `CLAUDE.md`**

In `CLAUDE.md`, the file currently opens with:

```markdown
See [constitution.md](constitution.md) for the authoritative development rules and architecture spec.
```

Change it to:

```markdown
See [constitution.md](constitution.md) for the authoritative development rules and architecture spec.  
See [docs/specs/README.md](docs/specs/README.md) for game design intent and mechanic vocabulary.
```

- [ ] **Step 3: Commit**

```bash
git add constitution.md CLAUDE.md
git commit -m "Wire CLAUDE.md and constitution.md to docs/specs"
```
