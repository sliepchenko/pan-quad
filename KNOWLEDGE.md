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

| Servo ID | Leg | Joint |
|---|---|---|
| S1 | Front-Left | Shoulder |
| S2 | Front-Left | Knee |
| S3 | Front-Right | Shoulder |
| S4 | Front-Right | Knee |
| S5 | Rear-Left | Shoulder |
| S6 | Rear-Left | Knee |
| S7 | Rear-Right | Shoulder |
| S8 | Rear-Right | Knee |

> **Note:** Exact left/right and front/rear assignments should be verified physically. Servo orientation (whether 90° is neutral or another angle) depends on how each servo is mechanically mounted.

---

## Robot States

### `useStateStand()`

The robot stands upright. This is the primary/idle state, triggered by Button A.

| Servo | Angle | Description |
|---|---|---|
| S1 | 45 | Front-Left Shoulder |
| S2 | 90 | Front-Left Knee |
| S3 | 135 | Front-Right Shoulder |
| S4 | 90 | Front-Right Knee |
| S5 | 225 | Rear-Left Shoulder |
| S6 | 90 | Rear-Left Knee |
| S7 | 315 | Rear-Right Shoulder |
| S8 | 90 | Rear-Right Knee |

### `useState135()`

Sets all servos to 135°. Triggered by Button B.

| Servo | Angle |
|---|---|
| S1 | 135 |
| S2 | 135 |
| S3 | 135 |
| S4 | 135 |
| S5 | 135 |
| S6 | 135 |
| S7 | 135 |
| S8 | 135 |

### `useStateCrab()`

Sweeps all 8 servos simultaneously from 0° to 360° in steps of 10°, pausing 500 ms between each step. Triggered by Button A+B. Total sweep takes ~37 seconds (37 steps × 500 ms).

| Step | Angle |
|---|---|
| 1 | 0° |
| 2 | 10° |
| … | … |
| 37 | 360° |

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
| A | `useStateReset()` — all servos to 45°, hard reset |
| B | `useState135()` — all servos to 135° |
| A+B | `useStateCrab()` — sweep all servos 0°→360° in 10° steps, 500 ms pause each |
| Logo (touch) | `useStateReset()` — all servos to 45°, hard reset |

---

## Code Architecture

```
index.js
├── let initialized = false            — guard flag to prevent double startup animation
├── if (!initialized) → showInitLightShow()  — called once on startup
│
├── input.onButtonPressed(Button.A)   → useStateReset()
├── input.onButtonPressed(Button.B)   → useState135()
├── input.onButtonPressed(Button.AB)  → useStateCrab()
├── input.onLogoEvent(Pressed)        → useStateReset()
│
├── useState135()                     — all 8 servos to 135°
├── useStateCrab()                    — sweep all 8 servos 0°→360° in 10° steps, 500ms pause
├── useStateReset()                   — all 8 servos to 45° (hard reset)
├── useStateStand()                   — 8 servo calls for standing pose
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

3. **Button A+B triggers `useStateCrab()`** — sweeps all servos 0°→360° in 10° steps with 500 ms pauses (~37 s total).

4. **`basic.forever()` is empty.** Reserved for gait animation or sensor polling. No walking gait is implemented yet.

5. **No walking/gait states.** Only two static poses exist (stand, transport). A walking gait requires a timed sequence of servo positions — not yet implemented.

6. **No sensor integration.** The micro:bit's accelerometer, compass, or distance sensors are not used. The robot cannot detect obstacles or orientation.

7. **Servo angles not validated against physical limits.** S7 is set to 315° in `useStateStand()`. If the physical servo only supports 0–270°, this may cause servo strain. Verify on hardware.

8. **No error handling.** MakeCode JS does not surface servo driver errors. If the RobotBit is not powered separately, servos may not respond without any indication.

9. **`showInitLightShow()` double-play.** MakeCode's runtime (with `basic.forever` present) can re-enter the top-level "on start" block in some runtime versions, causing the startup animation to play twice. Fixed by guarding the call with an `initialized` boolean flag.
