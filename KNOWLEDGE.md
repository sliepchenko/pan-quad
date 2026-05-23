# pan-quad — Knowledge Base

> A quadruped (4-legged) robot controlled by a BBC micro:bit V2 with the Kitronik RobotBit expansion board.
> Code is written in MakeCode JavaScript and deployed via the MakeCode web editor or USB drag-and-drop.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Hardware Configuration](#hardware-configuration)
3. [Servo Mapping](#servo-mapping)
4. [Robot States](#robot-states)
5. [LED Helpers](#led-helpers)
6. [Input Bindings](#input-bindings)
7. [Code Architecture](#code-architecture)
8. [Technical Decisions](#technical-decisions)
9. [Known Issues & Limitations](#known-issues--limitations)

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
| Servo type | Standard PWM hobby servo (0–270° range used) |
| LED | RobotBit onboard NeoPixel RGB (1 pixel) |
| Power | Battery via RobotBit power input |

---

## Servo Mapping

The robot has 4 legs. Each leg uses 2 servos: one for the **shoulder** (hip rotation) and one for the **knee** (leg lift/lower).

| Servo ID | Alias | Leg | Joint |
|---|---|---|---|
| S1 | `SHOULDER_FL` | Front-Left | Shoulder |
| S2 | `KNEE_1` | Front-Left | Knee |
| S3 | `SHOULDER_RL` | Front-Right | Shoulder |
| S4 | `KNEE_2` | Front-Right | Knee |
| S5 | `SHOULDER_3` | Rear-Left | Shoulder |
| S6 | `KNEE_3` | Rear-Left | Knee |
| S7 | `SHOULDER_FR` | Rear-Right | Shoulder |
| S8 | `KNEE_4` | Rear-Right | Knee |

> **Joint grouping:**
 > - **Shoulders (hip rotation):** SHOULDER_FL, SHOULDER_RL, SHOULDER_3, SHOULDER_FR (S1, S3, S5, S7)
> - **Knees (leg lift/lower):** KNEE_1, KNEE_2, KNEE_3, KNEE_4 (S2, S4, S6, S8)

> **Alias consts** are defined at the top of `index.js` (lines 9–16) and must be used in all servo calls instead of raw `robotbit.Servos.Sx` references.

> **Note:** Exact left/right and front/rear assignments should be verified physically. Servo orientation (whether 90° is neutral or another angle) depends on how each servo is mechanically mounted.

---

## Robot States

### `useStateDefault()`

All shoulders set to `NEUTRAL_ANGLE` (110°). Knees use the same configuration as `useStateStand()`.

| Servo | Angle | Description |
|---|---|---|
| S1 (SHOULDER_FL) | NEUTRAL_ANGLE (110) | Front-Left Shoulder |
| S3 (SHOULDER_RL) | NEUTRAL_ANGLE (110) | Front-Right Shoulder |
| S5 (SHOULDER_RR) | NEUTRAL_ANGLE (110) | Rear-Left Shoulder |
| S7 (SHOULDER_FR) | NEUTRAL_ANGLE (110) | Rear-Right Shoulder |
| S2 (KNEE_FL) | MIN_ANGLE (0) | Front-Left Knee |
| S4 (KNEE_RL) | MAX_ANGLE (220) | Front-Right Knee |
| S6 (KNEE_RR) | MIN_ANGLE (0) | Rear-Left Knee |
| S8 (KNEE_FR) | MAX_ANGLE (220) | Rear-Right Knee |

### `useStateLie()`

The robot lies flat. Only the shoulder servos (odd IDs: S1, S3, S5, S7) are moved to 110°. Knee servos (even IDs: S2, S4, S6, S8) are intentionally left untouched — they remain at whatever angle they were in previously.

| Servo | Angle | Description |
|---|---|---|
| S1 | 110 | Front-Left Shoulder (SHOULDER_FL) |
| S2 | (unchanged) | Front-Left Knee |
| S3 | 110 | Front-Right Shoulder |
| S4 | (unchanged) | Front-Right Knee |
| S5 | 110 | Rear-Left Shoulder |
| S6 | (unchanged) | Rear-Left Knee |
| S7 | 110 | Rear-Right Shoulder (SHOULDER_FR) |
| S8 | (unchanged) | Rear-Right Knee |

### `useStateStand()`

The robot stands upright. This is the primary/idle state, triggered by Button A.

| Servo | Angle | Description |
|---|---|---|
| S1 | 45 | Front-Left Shoulder (SHOULDER_FL) |
| S2 | 90 | Front-Left Knee |
| S3 | 135 | Front-Right Shoulder |
| S4 | 90 | Front-Right Knee |
| S5 | 225 | Rear-Left Shoulder |
| S6 | 90 | Rear-Left Knee |
| S7 | 315 | Rear-Right Shoulder (SHOULDER_FR) |
| S8 | 90 | Rear-Right Knee |

### `useStateMinus130()`

Sets all servos to -130°. Triggered by Button A.

> **Note:** This state predates the introduction of `MIN_ANGLE`/`MAX_ANGLE` constants. It is preserved for reference only; the active minimum state is now `useStateMinimum()`.

| Servo | Angle |
|---|---|
| S1 | -130 |
| S2 | -130 |
| S3 | -130 |
| S4 | -130 |
| S5 | -130 |
| S6 | -130 |
| S7 | -130 |
| S8 | -130 |

### `useState230()`

Sets all servos to 230°. Triggered by Button B.

> **Note:** This state predates the introduction of `MIN_ANGLE`/`MAX_ANGLE` constants. It is preserved for reference only; the active maximum state is now `useStateMaximum()`.

| Servo | Angle |
|---|---|
| S1 | 230 |
| S2 | 230 |
| S3 | 230 |
| S4 | 230 |
| S5 | 230 |
| S6 | 230 |
| S7 | 230 |
| S8 | 230 |

### `useStateCrab()`

Sweeps all 8 servos simultaneously from `MIN_ANGLE` to `MAX_ANGLE` in steps of 10°, pausing 500 ms between each step. Triggered by Button A+B.

| Step | Angle |
|---|---|
| 1 | -130° |
| 2 | -120° |
| … | … |
| 37 | 230° |

### `useStateMaximumKnees()`

Sets all knee servos to `MAX_ANGLE`. Shoulders are untouched.

| Servo | Angle |
|---|---|
| S2 (KNEE_1) | MAX_ANGLE |
| S4 (KNEE_2) | MAX_ANGLE |
| S6 (KNEE_3) | MAX_ANGLE |
| S8 (KNEE_4) | MAX_ANGLE |

### `useStateMaximumShoulders()`

Sets all shoulder servos to `MAX_ANGLE`. Knees are untouched.

| Servo | Angle |
|---|---|
| S1 (SHOULDER_FL) | MAX_ANGLE |
| S3 (SHOULDER_RL) | MAX_ANGLE |
| S5 (SHOULDER_3) | MAX_ANGLE |
| S7 (SHOULDER_FR) | MAX_ANGLE |

### `useStateMinimumKnees()`

Sets all knee servos to `MIN_ANGLE`. Shoulders are untouched.

| Servo | Angle |
|---|---|
| S2 (KNEE_1) | MIN_ANGLE |
| S4 (KNEE_2) | MIN_ANGLE |
| S6 (KNEE_3) | MIN_ANGLE |
| S8 (KNEE_4) | MIN_ANGLE |

### `useStateMinimumShoulders()`

Sets all shoulder servos to `MIN_ANGLE`. Knees are untouched.

| Servo | Angle |
|---|---|
| S1 (SHOULDER_FL) | MIN_ANGLE |
| S3 (SHOULDER_RL) | MIN_ANGLE |
| S5 (SHOULDER_3) | MIN_ANGLE |
| S7 (SHOULDER_FR) | MIN_ANGLE |

### `useStateReset()`

Resets all servos to 45°. Triggered by Button A and Logo touch. All 8 servos (S1–S8) are set simultaneously to 45° with no pauses — acts as a hard stop/reset for the robot.

| Servo | Angle |
|---|---|
| S1 | 45 |
| S2 | 45 |
| S3 | 45 |
| S4 | 45 |
| S5 | 45 |
| S6 | 45 |
| S7 | 45 |
| S8 | 45 |

---

## LED Helpers

RobotBit's NeoPixel is controlled via `robotbit.rgb().showColor(neopixel.hsl(h, s, l))`.

| Function | HSL Values | Intended Color | Used For |
|---|---|---|---|
| `showGreenLed()` | hsl(120, 74, 1) | Green | (defined, usage TBD) |
| `showInitLightShow()` | hsl(0, 100, 1) red per pixel | Red scanner (dim) | On-init startup animation |
| `showRedLed()` | hsl(0, 100, 1) | Red | (defined, usage TBD) |
| `showYellowLed()` | hsl(120, 74, 1) | Green (mislabeled) | (defined, usage TBD) |
| `showLegsLed()` | hsl(0, 0, 0) | Off/Black | (defined, usage TBD) |

> **Known Issue:** `showYellowLed()` uses the same HSL values as `showGreenLed()` — both produce green, not yellow. Yellow would require approximately `hsl(60, 100, 50)`. This is likely a copy-paste error.

> **Note:** `showInitLightShow()` uses `strip.setPixelColor()` / `strip.show()` for individual pixel control, unlike the other helpers which use `showColor()` (sets all pixels at once). The RobotBit NeoPixel strip has 4 pixels (indices 0–3).

---

## Input Bindings

| Input | Action |
|---|---|
| A | `useStateMinus130()` — all servos to -130° |
| B | `useState230()` — all servos to 230° |
| A+B | `useStateCrab()` — sweep all servos -130°→230° in 10° steps, 500 ms pause each |
| Logo (touch) | `useStateReset()` — all servos to 45°, hard reset |

---

## Code Architecture

```
index.js
├── const MIN_ANGLE = 0                — minimum angle for all servos
├── const MAX_ANGLE = 220              — maximum angle for all servos
├── const NEUTRAL_ANGLE = 110          — midpoint/neutral resting angle for all servos
├── const SHOULDER_FL = robotbit.Servos.S1  — Front-Left  Shoulder alias
├── const KNEE_1     = robotbit.Servos.S2  — Front-Left  Knee alias
├── const SHOULDER_RL = robotbit.Servos.S3  — Front-Right Shoulder alias
├── const KNEE_2     = robotbit.Servos.S4  — Front-Right Knee alias
├── const SHOULDER_3 = robotbit.Servos.S5  — Rear-Left   Shoulder alias
├── const KNEE_3     = robotbit.Servos.S6  — Rear-Left   Knee alias
├── const SHOULDER_FR = robotbit.Servos.S7  — Rear-Right  Shoulder alias
├── const KNEE_4     = robotbit.Servos.S8  — Rear-Right  Knee alias
├── let initialized = false            — guard flag to prevent double startup animation
├── if (!initialized) → showInitLightShow()  — called once on startup
│
├── input.onButtonPressed(Button.A)   → useStateMinus130()
├── input.onButtonPressed(Button.B)   → useState230()
├── input.onButtonPressed(Button.AB)  → useStateCrab()
├── input.onLogoEvent(Pressed)        → useStateReset()
│
├── useState230()                     — all 8 servos to 230°
├── useStateCrab()                    — sweep all 8 servos MIN→MAX in 10° steps, 500ms pause
├── useStateDefault()                 — shoulders to NEUTRAL_ANGLE; knees same as useStateStand()
├── useStateLie()                     — shoulders (S1,S3,S5,S7) to 110°; knees untouched
├── useStateMaximum()                 — all 8 servos to SHOULDER/KNEE_MAX_ANGLE
├── useStateMaximumKnees()            — knees (S2,S4,S6,S8) to KNEE_MAX_ANGLE
├── useStateMaximumShoulders()        — shoulders (S1,S3,S5,S7) to SHOULDER_MAX_ANGLE
├── useStateMinus130()                — all 8 servos to -130°
├── useStateMinimum()                 — all 8 servos to SHOULDER/KNEE_MIN_ANGLE
├── useStateMinimumKnees()            — knees (S2,S4,S6,S8) to KNEE_MIN_ANGLE
├── useStateMinimumShoulders()        — shoulders (S1,S3,S5,S7) to SHOULDER_MIN_ANGLE
├── useStateReset()                   — all 8 servos to 45° (hard reset)
├── useStateStand()                   — 8 servo calls for standing pose
│
├── doFrontLeftKneeDown/Straight/Up() — atomic knee actions, Front-Left leg
├── doFrontLeftShoulderBack/Forward/Straight() — atomic shoulder actions, Front-Left leg
├── doFrontRightKneeDown/Straight/Up() — atomic knee actions, Front-Right leg
├── doFrontRightShoulderBack/Forward/Straight() — atomic shoulder actions, Front-Right leg
├── doRearLeftKneeDown/Straight/Up()  — atomic knee actions, Rear-Left leg
├── doRearLeftShoulderBack/Forward/Straight() — atomic shoulder actions, Rear-Left leg
├── doRearRightKneeDown/Straight/Up() — atomic knee actions, Rear-Right leg
├── doRearRightShoulderBack/Forward/Straight() — atomic shoulder actions, Rear-Right leg
│
├── showGreenLed()                    — NeoPixel green
├── showInitLightShow()               — red scanner across pixels 0→3 on startup
├── showLegsLed()                     — NeoPixel off
├── showRedLed()                      — NeoPixel red
├── showYellowLed()                   — NeoPixel (mislabeled, actually green)
│
└── basic.forever()                   — empty (reserved for future sensor/animation logic)
```

**Key invariants:**
- All state functions are named `useState<StateName>()`.
- State functions contain only servo angle assignments — no logic or conditionals.
- `basic.forever()` is intentionally empty; reserved for gait loops or sensor polling.
- Button A+B is intentionally empty; reserved for future combined actions.
- **All functions must be placed at the bottom of the file, ordered alphabetically (A to Z) by function name.**

---

## Atomic Joint Action Functions

These 24 single-servo helper functions are the building blocks for gait sequences. Each sets exactly one servo to the appropriate angle for the named action.

### Angle semantics

| Side | Knee down (standing) | Knee up (lifted) | Shoulder forward | Shoulder back |
|---|---|---|---|---|
| FL / RR (left side) | `MIN_ANGLE` (0) | `MAX_ANGLE` (220) | `MAX_ANGLE` (220) | `MIN_ANGLE` (0) |
| FR / RL (right side) | `MAX_ANGLE` (220) | `MIN_ANGLE` (0) | `MIN_ANGLE` (0) | `MAX_ANGLE` (220) |

Straight / neutral for all joints = `NEUTRAL_ANGLE` (110).

### Knee functions

| Function | Servo | Angle |
|---|---|---|
| `doFrontLeftKneeDown()` | `KNEE_FL` | `MIN_ANGLE` |
| `doFrontLeftKneeStraight()` | `KNEE_FL` | `NEUTRAL_ANGLE` |
| `doFrontLeftKneeUp()` | `KNEE_FL` | `MAX_ANGLE` |
| `doFrontRightKneeDown()` | `KNEE_RL` | `MAX_ANGLE` |
| `doFrontRightKneeStraight()` | `KNEE_RL` | `NEUTRAL_ANGLE` |
| `doFrontRightKneeUp()` | `KNEE_RL` | `MIN_ANGLE` |
| `doRearLeftKneeDown()` | `KNEE_RR` | `MIN_ANGLE` |
| `doRearLeftKneeStraight()` | `KNEE_RR` | `NEUTRAL_ANGLE` |
| `doRearLeftKneeUp()` | `KNEE_RR` | `MAX_ANGLE` |
| `doRearRightKneeDown()` | `KNEE_FR` | `MAX_ANGLE` |
| `doRearRightKneeStraight()` | `KNEE_FR` | `NEUTRAL_ANGLE` |
| `doRearRightKneeUp()` | `KNEE_FR` | `MIN_ANGLE` |

### Shoulder functions

| Function | Servo | Angle |
|---|---|---|
| `doFrontLeftShoulderBack()` | `SHOULDER_FL` | `MIN_ANGLE` |
| `doFrontLeftShoulderForward()` | `SHOULDER_FL` | `MAX_ANGLE` |
| `doFrontLeftShoulderStraight()` | `SHOULDER_FL` | `NEUTRAL_ANGLE` |
| `doFrontRightShoulderBack()` | `SHOULDER_RL` | `MAX_ANGLE` |
| `doFrontRightShoulderForward()` | `SHOULDER_RL` | `MIN_ANGLE` |
| `doFrontRightShoulderStraight()` | `SHOULDER_RL` | `NEUTRAL_ANGLE` |
| `doRearLeftShoulderBack()` | `SHOULDER_RR` | `MIN_ANGLE` |
| `doRearLeftShoulderForward()` | `SHOULDER_RR` | `MAX_ANGLE` |
| `doRearLeftShoulderStraight()` | `SHOULDER_RR` | `NEUTRAL_ANGLE` |
| `doRearRightShoulderBack()` | `SHOULDER_FR` | `MAX_ANGLE` |
| `doRearRightShoulderForward()` | `SHOULDER_FR` | `MIN_ANGLE` |
| `doRearRightShoulderStraight()` | `SHOULDER_FR` | `NEUTRAL_ANGLE` |

---

## Technical Decisions

### MakeCode JavaScript over Python
MakeCode JS was chosen for RobotBit compatibility and broad beginner tooling support (block ↔ JS toggle in the editor).

### `robotbit` extension API
All servo and LED calls go through the `robotbit` namespace. This is the standard Kitronik RobotBit MakeCode extension. Servo angles are passed as integers in degrees.

### Servo angle range
RobotBit supports 0–270° range on its servo outputs. The current states use angles within 0–315°. Care should be taken not to exceed physical servo limits — exceeding mechanical range can damage servos.

### State functions (no state machine)
Currently there is no formal state machine or state variable. Each button directly calls a state function. If more states are added, consider tracking the active state with a variable to enable transitions or guards.

### LED helpers not yet wired to states
`showGreenLed`, `showRedLed`, etc. are defined but not called from state functions. Future work should call these from within state functions to give visual feedback of the current state.

---

## Known Issues & Limitations

1. **`showYellowLed()` produces green, not yellow.** HSL(120, 74, 1) is green. Yellow requires approx. HSL(60, 100, 50). Fix when LED state feedback is wired up.

2. **LED helpers are unused.** None of the LED helper functions are called from button handlers or state functions. No visual feedback is currently active.

3. **Button A+B triggers `useStateCrab()`** — sweeps all servos -130°→230° in 10° steps with 500 ms pauses (~37 s total).

4. **`basic.forever()` is empty.** Reserved for gait animation or sensor polling. No walking gait is implemented yet.

5. **No walking/gait states.** Only two static poses exist (stand, transport). A walking gait requires a timed sequence of servo positions — not yet implemented.

6. **No sensor integration.** The micro:bit's accelerometer, compass, or distance sensors are not used. The robot cannot detect obstacles or orientation.

7. **Servo angles not validated against physical limits.** S7 is set to 315° in `useStateStand()`. If the physical servo only supports 0–270°, this may cause servo strain. Verify on hardware.

8. **No error handling.** MakeCode JS does not surface servo driver errors. If the RobotBit is not powered separately, servos may not respond without any indication.

9. **`showInitLightShow()` double-play.** MakeCode's runtime (with `basic.forever` present) can re-enter the top-level "on start" block in some runtime versions, causing the startup animation to play twice. Fixed by guarding the call with an `initialized` boolean flag.
