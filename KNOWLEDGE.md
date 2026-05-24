# pan-quad — Knowledge Base

> A quadruped (4-legged) robot controlled by a BBC micro:bit V2 with the Kitronik RobotBit expansion board.
> Code is written in MakeCode JavaScript and deployed via the MakeCode web editor or USB drag-and-drop.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Hardware Configuration](#hardware-configuration)
3. [Servo Mapping](#servo-mapping)
4. [Angle Constants](#angle-constants)
5. [Sonar Distance Constants](#sonar-distance-constants)
6. [Colour Constants](#colour-constants)
7. [Robot States & Actions](#robot-states--actions)
8. [Gait Functions](#gait-functions)
9. [Atomic Joint Action Functions](#atomic-joint-action-functions)
10. [LED Helpers](#led-helpers)
11. [Input Bindings](#input-bindings)
12. [Startup Sequence](#startup-sequence)
13. [Code Architecture](#code-architecture)
14. [Technical Decisions](#technical-decisions)
15. [Known Issues & Limitations](#known-issues--limitations)

---

## Project Overview

**pan-quad** is a 4-legged walking robot (quadruped) built on a BBC micro:bit V2 and controlled via a Kitronik RobotBit board. The robot has two servo motors per leg (8 servos total), driven by the RobotBit's servo outputs S1–S8. The onboard NeoPixel RGB LED is used for status indication.

The main source file is `index.js`. There is no build pipeline — code is written and flashed directly via the [MakeCode editor](https://makecode.microbit.org/).

> **Constraint:** All code changes must be made exclusively in `index.js`. No other files should be created or modified for code changes.

---

## Hardware Configuration

| Component | Details |
|---|---|
| Microcontroller | BBC micro:bit V2 |
| Expansion board | Kitronik RobotBit |
| Servo count | 8 (2 per leg) |
| Servo type | Standard PWM hobby servo |
| LED | RobotBit onboard NeoPixel RGB (4 pixels, indices 0–3) |
| Power | Battery via RobotBit power input |

---

## Servo Mapping

The robot has 4 legs. Each leg uses 2 servos: one for the **shoulder** (hip rotation) and one for the **knee** (leg lift/lower).

| Servo ID | Alias const | Leg | Joint |
|---|---|---|---|
| S1 | `SHOULDER_FL` | Front-Left | Shoulder |
| S2 | `KNEE_FL` | Front-Left | Knee |
| S3 | `SHOULDER_RL` | Rear-Left | Shoulder |
| S4 | `KNEE_RL` | Rear-Left | Knee |
| S5 | `SHOULDER_RR` | Rear-Right | Shoulder |
| S6 | `KNEE_RR` | Rear-Right | Knee |
| S7 | `SHOULDER_FR` | Front-Right | Shoulder |
| S8 | `KNEE_FR` | Front-Right | Knee |

> **Alias consts** are defined at the top of `index.js` (lines 10–17) and must be used in all servo calls instead of raw `robotbit.Servos.Sx` references.

> **Note:** Right-side servos (FR, RR) are mechanically mirrored — their "down" and "forward" directions are opposite in angle to the left-side servos. See [Atomic Joint Action Functions](#atomic-joint-action-functions) for the full angle table.

---

## Angle Constants

Defined at the top of `index.js` (lines 3–7):

| Constant | Value | Meaning |
|---|---|---|
| `MIN_ANGLE` | 10 | Minimum servo angle |
| `QUARTER_ANGLE` | 55 | 25% of range (~quarter position) |
| `NEUTRAL_ANGLE` | 110 | Midpoint / neutral resting position |
| `THREE_QUARTER_ANGLE` | 165 | 75% of range |
| `MAX_ANGLE` | 210 | Maximum servo angle |

> **Physical range:** Servos operate between 10° and 210°. Do not command angles outside this range to avoid mechanical damage.

---

## Sonar Distance Constants

Defined in `index.js` after the angle constants:

| Constant | Value | Meaning |
|---|---|---|
| `SONAR_NO_ECHO` | 0 | `sonar.ping()` return value when no echo received (out of range / no object) |
| `SONAR_OBSTACLE_THRESHOLD` | 20 | Distance (cm) above which the path is considered clear (LED green); at or below → LED red |

Used in `basic.forever()` and `showObstacleLed()`.

---

## Colour Constants

Defined in `index.js` after the sonar constants. All are precomputed NeoPixel HSL colour values:

| Constant | HSL | Colour | Usage |
|---|---|---|---|
| `COLOR_OFF` | hsl(0, 0, 0) | Off / black | Pixel off state |
| `COLOR_RED` | hsl(0, 100, 1) | Red (dim) | Init light show, `showRedLed()` |
| `COLOR_GREEN` | hsl(120, 74, 1) | Green (dim) | `showGreenLed()`, `showYellowLed()`, obstacle LED clear zone |

> **Note:** `COLOR_GREEN_DIM` is used by both `showGreenLed()` and `showYellowLed()` — `showYellowLed()` is still mislabeled (produces green, not yellow).

---

## Robot States & Actions

### `doReset()`

Sets all 8 servos to `NEUTRAL_ANGLE` (110°). Used as a hard reset/home position. Called on startup and mapped to Button A+B.

| Servo | Angle |
|---|---|
| SHOULDER_FL | 110 (NEUTRAL_ANGLE) |
| KNEE_FL | 110 (NEUTRAL_ANGLE) |
| SHOULDER_RL | 110 (NEUTRAL_ANGLE) |
| KNEE_RL | 110 (NEUTRAL_ANGLE) |
| SHOULDER_RR | 110 (NEUTRAL_ANGLE) |
| KNEE_RR | 110 (NEUTRAL_ANGLE) |
| SHOULDER_FR | 110 (NEUTRAL_ANGLE) |
| KNEE_FR | 110 (NEUTRAL_ANGLE) |

### `doStay()`

Standing/stay pose. Shoulders centred at `NEUTRAL_ANGLE`; knees pushed to their "down" (extended/standing) angles. Mapped to Button B.

| Servo | Angle | Description |
|---|---|---|
| SHOULDER_FL | NEUTRAL_ANGLE (110) | Shoulder centred |
| SHOULDER_RL | NEUTRAL_ANGLE (110) | Shoulder centred |
| SHOULDER_RR | NEUTRAL_ANGLE (110) | Shoulder centred |
| SHOULDER_FR | NEUTRAL_ANGLE (110) | Shoulder centred |
| KNEE_FL | MIN_ANGLE (10) | Knee down (FL — left-side "down" = MIN) |
| KNEE_RL | MAX_ANGLE (210) | Knee down (RL — right-side "down" = MAX) |
| KNEE_RR | MIN_ANGLE (10) | Knee down (RR — left-side "down" = MIN) |
| KNEE_FR | MAX_ANGLE (210) | Knee down (FR — right-side "down" = MAX) |

### `doStand()`

Sets all knees to their "down" (extended) angles; shoulders are untouched.

| Servo | Angle |
|---|---|
| KNEE_FL | MIN_ANGLE (10) |
| KNEE_RL | MAX_ANGLE (210) |
| KNEE_RR | MIN_ANGLE (10) |
| KNEE_FR | MAX_ANGLE (210) |

### `doLie()`

Sets all knees to `NEUTRAL_ANGLE` (110°) — legs fold to a mid-position, lowering the chassis. Shoulders untouched. Mapped to Button A.

| Servo | Angle |
|---|---|
| KNEE_FL | NEUTRAL_ANGLE (110) |
| KNEE_RL | NEUTRAL_ANGLE (110) |
| KNEE_RR | NEUTRAL_ANGLE (110) |
| KNEE_FR | NEUTRAL_ANGLE (110) |

---

## Gait Functions

### `stepForward(step: number)`

Walk gait — one leg at a time, sequential order: BL → FL → BR → FR. Mapped to Logo touch. **Implemented.**

Each phase has 3 sub-steps (each separated by `step` ms):
1. Swing knee up + 3 stance shoulders move backward simultaneously
2. Swing shoulder forward
3. Swing knee down

Full order:
1. Rear-Left (BL): knee up + (FL, BR, FR shoulders backward) → BL shoulder forward → BL knee down
2. Front-Left (FL): knee up + (BL, BR, FR shoulders backward) → FL shoulder forward → FL knee down
3. Rear-Right (BR): knee up + (BL, FL, FR shoulders backward) → BR shoulder forward → BR knee down
4. Front-Right (FR): knee up + (BL, FL, BR shoulders backward) → FR shoulder forward → FR knee down

While one leg swings, the other three planted shoulders move backward in unison to push the chassis forward.

### `doTurnRight(step: number)`

Turn-right gait — diagonal pair structure, same timing as `doStepForward`. Left-side legs push forward while right-side legs push backward, rotating the chassis clockwise.

**Phase 1 — FR + RL:**
1. FR knee to NEUTRAL, RL knee to NEUTRAL → pause
2. FR shoulder **backward**, RL shoulder **forward** → pause
3. FR knee down, RL knee down → pause
4. FR shoulder straight, RL shoulder straight

**Phase 2 — FL + RR:**
1. FL knee to NEUTRAL, RR knee to NEUTRAL → pause
2. FL shoulder **forward**, RR shoulder **backward** → pause
3. FL knee down, RR knee down → pause
4. FL shoulder straight, RR shoulder straight

Not yet bound to any input.

### `stepForwardV1(speed: number)`

Diagonal pair gait — moves two diagonal legs (FL+RR, then FR+RL) in sequence.

**Phase 1 — FL + RR:**
1. FL knee to NEUTRAL, RR knee to NEUTRAL → pause
2. FL shoulder to NEUTRAL, RR shoulder to MAX → pause
3. FL knee to MIN, RR knee to MIN → pause
4. FL shoulder to MAX, RR shoulder to NEUTRAL → pause

**Phase 2 — FR + RL:**
1. FR knee to NEUTRAL, RL knee to NEUTRAL → pause
2. FR shoulder to NEUTRAL, RL shoulder to MIN → pause
3. FR knee to MAX, RL knee to MAX → pause
4. FR shoulder to MIN, RL shoulder to NEUTRAL → pause

### `stepForwardV2(speed: number)`

Diagonal pair gait — alternative ordering (starts with RL+FR, then FL+RR).

**Phase 1 — RL + FR:**
1. RL knee to NEUTRAL, FR knee to NEUTRAL → pause
2. RL shoulder to MIN, FR shoulder to NEUTRAL → pause
3. RL knee to MAX, FR knee to MAX → pause
4. RL shoulder to NEUTRAL, FR shoulder to MIN → pause

**Phase 2 — FL + RR:**
1. FL knee to NEUTRAL, RR knee to NEUTRAL → pause
2. FL shoulder to NEUTRAL, RR shoulder to MAX → pause
3. FL knee to MIN, RR knee to MIN → pause
4. FL shoulder to MAX, RR shoulder to NEUTRAL → pause

---

## Atomic Joint Action Functions

24 single-servo helper functions — the building blocks for gait sequences. Each sets exactly one servo to the angle appropriate for the named action.

### Angle semantics

| Side | Knee down (standing) | Knee up (lifted) | Shoulder forward | Shoulder backward |
|---|---|---|---|---|
| FL / RR (left-side mounting) | `MIN_ANGLE` (10) | `MAX_ANGLE` (210) | `MIN_ANGLE` (10) | `MAX_ANGLE` (210) |
| FR / RL (right-side mounting) | `MAX_ANGLE` (210) | `MIN_ANGLE` (10) | `MAX_ANGLE` (210) | `MIN_ANGLE` (10) |

Straight / neutral for all joints = `NEUTRAL_ANGLE` (110).

### Knee functions

| Function | Servo | Angle |
|---|---|---|
| `doFrontLeftKneeUp()` | `KNEE_FL` | `MAX_ANGLE` (210) |
| `doFrontLeftKneeStraight()` | `KNEE_FL` | `NEUTRAL_ANGLE` (110) |
| `doFrontLeftKneeDown()` | `KNEE_FL` | `MIN_ANGLE` (10) |
| `doRearLeftKneeUp()` | `KNEE_RL` | `MIN_ANGLE` (10) |
| `doRearLeftKneeStraight()` | `KNEE_RL` | `NEUTRAL_ANGLE` (110) |
| `doRearLeftKneeDown()` | `KNEE_RL` | `MAX_ANGLE` (210) |
| `doRearRightKneeUp()` | `KNEE_RR` | `MAX_ANGLE` (210) |
| `doRearRightKneeStraight()` | `KNEE_RR` | `NEUTRAL_ANGLE` (110) |
| `doRearRightKneeDown()` | `KNEE_RR` | `MIN_ANGLE` (10) |
| `doFrontRightKneeUp()` | `KNEE_FR` | `MIN_ANGLE` (10) |
| `doFrontRightKneeStraight()` | `KNEE_FR` | `NEUTRAL_ANGLE` (110) |
| `doFrontRightKneeDown()` | `KNEE_FR` | `MAX_ANGLE` (210) |

### Shoulder functions

| Function | Servo | Angle |
|---|---|---|
| `doFrontLeftShoulderForward()` | `SHOULDER_FL` | `MIN_ANGLE` (10) |
| `doFrontLeftShoulderStraight()` | `SHOULDER_FL` | `NEUTRAL_ANGLE` (110) |
| `doFrontLeftShoulderBackward()` | `SHOULDER_FL` | `MAX_ANGLE` (210) |
| `doRearLeftShoulderForward()` | `SHOULDER_RL` | `MIN_ANGLE` (10) |
| `doRearLeftShoulderStraight()` | `SHOULDER_RL` | `NEUTRAL_ANGLE` (110) |
| `doRearLeftShoulderBackward()` | `SHOULDER_RL` | `MAX_ANGLE` (210) |
| `doRearRightShoulderForward()` | `SHOULDER_RR` | `MAX_ANGLE` (210) |
| `doRearRightShoulderStraight()` | `SHOULDER_RR` | `NEUTRAL_ANGLE` (110) |
| `doRearRightShoulderBackward()` | `SHOULDER_RR` | `MIN_ANGLE` (10) |
| `doFrontRightShoulderForward()` | `SHOULDER_FR` | `MAX_ANGLE` (210) |
| `doFrontRightShoulderStraight()` | `SHOULDER_FR` | `NEUTRAL_ANGLE` (110) |
| `doFrontRightShoulderBackward()` | `SHOULDER_FR` | `MIN_ANGLE` (10) |

---

## LED Helpers

RobotBit's NeoPixel is controlled via `robotbit.rgb().showColor(neopixel.hsl(h, s, l))`.

| Function | HSL Values | Actual Color | Notes |
|---|---|---|---|
| `showGreenLed()` | hsl(120, 74, 1) | Green (dim) | Defined, not called from any handler |
| `showInitLightShow()` | hsl(0, 100, 1) red per pixel | Red scanner | Called once on startup |
| `showRedLed()` | hsl(0, 100, 1) | Red (dim) | Defined, not called from any handler |
| `showYellowLed()` | hsl(120, 74, 1) | Green (mislabeled) | Same HSL as showGreenLed — bug |
| `showLegsLed()` | hsl(0, 0, 0) | Off/Black | Defined, not called from any handler |
| `showObstacleLed(distance)` | pixel 0 only | Off / Green / Red | distance=0 → off; >20 → green hsl(120,74,1); ≤20 → red hsl(0,100,1) |

> **Known Issue:** `showYellowLed()` uses the same HSL values as `showGreenLed()` — both produce green, not yellow. Yellow requires approximately `hsl(60, 100, 50)`. This is a copy-paste error.

> **Note:** `showInitLightShow()` uses `strip.setPixelColor()` / `strip.show()` for per-pixel animation (0→1→2→3→off). The RobotBit NeoPixel strip has 4 pixels (indices 0–3).

---

## Input Bindings

| Input | Action |
|---|---|
| A | `doLie()` — all knees to NEUTRAL_ANGLE |
| B | `doStay()` — shoulders centred, knees extended (standing) |
| A+B | `doReset()` — all 8 servos to NEUTRAL_ANGLE |
| Logo (touch) | `stepForward(200)` — walk gait stub (currently empty) |

---

## Startup Sequence

Executed once at the top of `index.js` on boot (lines 19–36):

1. `showInitLightShow()` — red LED scanner animation
2. `doReset()` — all servos to NEUTRAL_ANGLE (110°)
3. Front-Left knee: up (500ms pause) → down (500ms) → straight (500ms)
4. Rear-Left knee: up (500ms) → down (500ms) → straight (500ms)
5. Rear-Right knee: up (500ms) → down (500ms) → straight (500ms)
6. Front-Right knee: up (500ms) → down (500ms) → straight (500ms)

This sequence verifies that all four knees are functional on every boot. No `initialized` guard is present — `basic.forever()` is empty, so double-play is not a concern.

---

## Code Architecture

```
index.js
├── const MIN_ANGLE = 10               — minimum servo angle
├── const QUARTER_ANGLE = 55            — quarter-range angle
├── const NEUTRAL_ANGLE = 110          — midpoint / neutral angle
├── const THREE_QUARTER_ANGLE = 165    — three-quarter-range angle
├── const MAX_ANGLE = 210              — maximum servo angle
├── const SONAR_NO_ECHO = 0            — sonar.ping() sentinel: no echo received
├── const SONAR_OBSTACLE_THRESHOLD = 20 — distance above which path is clear (LED green); at/below → red
├── const COLOR_OFF                    — NeoPixel off (hsl 0,0,0)
├── const COLOR_RED                    — NeoPixel red dim (hsl 0,100,1)
├── const COLOR_GREEN                  — NeoPixel green dim (hsl 120,74,1)
├── const SHOULDER_FL = S1             — Front-Left  Shoulder alias
├── const KNEE_FL     = S2             — Front-Left  Knee alias
├── const SHOULDER_RL = S3             — Rear-Left   Shoulder alias
├── const KNEE_RL     = S4             — Rear-Left   Knee alias
├── const SHOULDER_RR = S5             — Rear-Right  Shoulder alias
├── const KNEE_RR     = S6             — Rear-Right  Knee alias
├── const SHOULDER_FR = S7             — Front-Right Shoulder alias
├── const KNEE_FR     = S8             — Front-Right Knee alias
│
├── showInitLightShow()                — startup LED animation
├── doReset()                          — all servos to NEUTRAL
├── <knee up/down/straight boot check per leg>
│
├── input.onLogoEvent(Pressed)         → stepForward(200)
├── input.onButtonPressed(Button.A)    → doLie()
├── input.onButtonPressed(Button.AB)   → doReset()
├── input.onButtonPressed(Button.B)    → doStay()
│
├── basic.forever()                    — sonar obstacle loop: reads distance, calls showObstacleLed(distance) on pixel 0, steps forward if distance=0 or >20 cm, else doReset()+doStay()
│
├── showInitLightShow()                — red pixel scanner
├── doStay()                           — shoulders centred, knees extended
├── stepForward(step)                  — walk gait (BL→FL→BR→FR, one leg at a time)
├── doTurnRight(step)                  — turn-right gait (diagonal pairs, left fwd / right back)
├── stepForwardV2(speed)               — diagonal pair gait v2
├── stepForwardV1(speed)               — diagonal pair gait v1
│
├── doFrontLeft/RearLeft/RearRight/FrontRight ShoulderForward/Straight/Backward()
├── doFrontLeft/RearLeft/RearRight/FrontRight KneeUp/Straight/Down()
│
├── doStand()                          — knees to extended angles, shoulders untouched
├── doLie()                            — all knees to NEUTRAL
├── doReset()                          — all 8 servos to NEUTRAL
│
├── showObstacleLed(distance)          — NeoPixel pixel 0: off (dist=0), green (dist>20), red (dist≤20)
├── showGreenLed()                     — NeoPixel green (dim)
├── showLegsLed()                      — NeoPixel off
├── showRedLed()                       — NeoPixel red (dim)
├── showYellowLed()                    — NeoPixel (mislabeled, actually green)
│
├── useStateMaximumKnees()             — all knees to MAX_ANGLE
├── useStateMaximumShoulders()         — all shoulders to MAX_ANGLE
├── useStateMinimumKnees()             — all knees to MIN_ANGLE
└── useStateMinimumShoulders()         — all shoulders to MIN_ANGLE
```

**Key invariants:**
- Primary action functions use the `do<Action>()` naming pattern.
- `useState*` helpers remain for max/min bulk-set operations.
- All atomic joint functions follow `do<Leg><Joint><Direction>()` naming.
- `basic.forever()` is intentionally empty; reserved for gait loops or sensor polling.
- Shoulder "Back" direction is named **Backward** in the code (not "Back").

---

## Technical Decisions

### MakeCode JavaScript over Python
MakeCode JS was chosen for RobotBit compatibility and broad beginner tooling support (block ↔ JS toggle in the editor).

### `robotbit` extension API
All servo and LED calls go through the `robotbit` namespace. Servo angles are passed as integers in degrees.

### Servo angle range clamped to 10–210°
Previous range was documented as 0–220°. Current constants clamp to `MIN_ANGLE=10` / `MAX_ANGLE=210` to avoid servo strain at mechanical extremes.

### `QUARTER_ANGLE` and `THREE_QUARTER_ANGLE` added
Two intermediate angle constants (55° and 165°) are defined for use in future smooth motion sequences. Not yet used by any function.

### `do*` naming over `useState*`
The primary robot action functions were renamed from `useState<Name>()` to `do<Action>()` for clearer imperative semantics. Some `useState*` bulk-set helpers remain for max/min operations.

### Boot self-test sequence
On startup, each knee runs up→down→straight after `doReset()`. This confirms all four knee servos are responsive before user input is accepted. 500 ms pauses between steps.

### No initialized guard
The previous `initialized` boolean guard was removed. Since `basic.forever()` is empty, the startup block does not risk double-execution.

### State functions (no state machine)
No formal state machine or state variable exists. Each button directly calls an action function. If more states are added, consider tracking the active state with a variable.

### LED helpers not wired to states
`showGreenLed`, `showRedLed`, etc. are defined but not called from any action or button handler. Future work should call these to give visual feedback of the current state.

---

## Known Issues & Limitations

1. **`showYellowLed()` produces green, not yellow.** HSL(120, 74, 1) is green. Yellow requires approx. HSL(60, 100, 50). Fix when LED state feedback is wired up.

2. **LED helpers are unused.** None of the LED helper functions (except `showInitLightShow`) are called. No visual feedback is currently active during operation.

3. **`stepForward()` is implemented.** Walk gait (one leg at a time, BL→FL→BR→FR) with simultaneous stance-phase shoulder push. Triggered by Logo touch at 200 ms per sub-step.

4. **`stepForwardV1` and `stepForwardV2` are not triggered by any button.** They exist as experiments/drafts but have no input binding.

5. **`basic.forever()` runs sonar-driven walk loop.** Each iteration reads the ultrasonic sensor on P1/P2. It calls `showObstacleLed(distance)` to update pixel 0. If distance = 0 (no echo / out of range) or distance > 10 cm, the robot calls `doStepForward(200)`; otherwise it calls `doReset()` + `doStay()` to stop.

6. **Sonar integration active.** HC-SR04-compatible sensor is connected: Trigger → P1, Echo → P2. Distance is read via `sonar.ping()` in Centimeters. A return value of `0` is treated as "no obstacle" (out of range).

  10. **`showObstacleLed(distance)` is active.** Called every `basic.forever()` iteration. Controls NeoPixel pixel 0 only: off when `distance === 0`; solid green (`hsl(120,74,1)`) when `distance > 20`; solid red (`hsl(0,100,1)`) when `distance ≤ 20`. Uses `setPixelColor` + `show` to avoid overwriting pixels 1–3.

7. **`QUARTER_ANGLE` and `THREE_QUARTER_ANGLE` are unused.** Defined but not referenced by any function yet.

8. **No error handling.** MakeCode JS does not surface servo driver errors. If the RobotBit is not powered separately, servos may not respond without any indication.

9. **`doStand()` is defined but has no input binding.** It sets knees to extended angles but is never called by a button handler.
