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

**Interacts with:** Player movement (must stay on), Player HP (damage when off), Bullets (destroyed on contact with zone walls).

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

**Interacts with:** Player HP (damage on contact), Safe zone walls (bullet destroyed on contact), Slow-Down Trigger (fire rate halves when trigger activates).

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
- Damage per bullet hit: instant kill (HP set to `0`)
- Damage per second off safe zone: `60` HP/s (1 HP per physics tick at 60 Hz)

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
