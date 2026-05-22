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
6. [Button Bindings](#button-bindings)
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

### `useStateTransportation()`

The robot folds into a compact flat position for transport or storage. Triggered by Button B.

| Servo | Angle | Description |
|---|---|---|
| S1 | 90 | Front-Left Shoulder |
| S2 | 180 | Front-Left Knee |
| S3 | 90 | Front-Right Shoulder |
| S4 | 0 | Front-Right Knee |
| S5 | 270 | Rear-Left Shoulder |
| S6 | 180 | Rear-Left Knee |
| S7 | 270 | Rear-Right Shoulder |
| S8 | 0 | Rear-Right Knee |

---

## LED Helpers

RobotBit's NeoPixel is controlled via `robotbit.rgb().showColor(neopixel.hsl(h, s, l))`.

| Function | HSL Values | Intended Color | Used For |
|---|---|---|---|
| `showGreenLed()` | hsl(120, 74, 1) | Green | (defined, usage TBD) |
| `showRedLed()` | hsl(0, 100, 1) | Red | (defined, usage TBD) |
| `showYellowLed()` | hsl(120, 74, 1) | Green (mislabeled) | (defined, usage TBD) |
| `showLegsLed()` | hsl(0, 0, 0) | Off/Black | (defined, usage TBD) |

> **Known Issue:** `showYellowLed()` uses the same HSL values as `showGreenLed()` — both produce green, not yellow. Yellow would require approximately `hsl(60, 100, 50)`. This is likely a copy-paste error.

---

## Button Bindings

| Button | Action |
|---|---|
| A | `useStateStand()` — stand/idle position |
| B | `useStateTransportation()` — flat/folded position |
| A+B | Reserved — currently empty handler |

---

## Code Architecture

```
index.js
├── input.onButtonPressed(Button.A)   → useStateStand()
├── input.onButtonPressed(Button.B)   → useStateTransportation()
├── input.onButtonPressed(Button.AB)  → (reserved, empty)
│
├── useStateStand()                   — 8 servo calls for standing pose
├── useStateTransportation()          — 8 servo calls for transport/flat pose
│
├── showGreenLed()                    — NeoPixel green
├── showRedLed()                      — NeoPixel red
├── showYellowLed()                   — NeoPixel (mislabeled, actually green)
├── showLegsLed()                     — NeoPixel off
│
└── basic.forever()                   — empty (reserved for future sensor/animation logic)
```

**Key invariants:**
- All state functions are named `useState<StateName>()`.
- State functions contain only servo angle assignments — no logic or conditionals.
- `basic.forever()` is intentionally empty; reserved for gait loops or sensor polling.
- Button A+B is intentionally empty; reserved for future combined actions.

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

3. **Button A+B is a no-op.** The handler exists but is empty. Reserved for future use.

4. **`basic.forever()` is empty.** Reserved for gait animation or sensor polling. No walking gait is implemented yet.

5. **No walking/gait states.** Only two static poses exist (stand, transport). A walking gait requires a timed sequence of servo positions — not yet implemented.

6. **No sensor integration.** The micro:bit's accelerometer, compass, or distance sensors are not used. The robot cannot detect obstacles or orientation.

7. **Servo angles not validated against physical limits.** S7 is set to 315° in `useStateStand()`. If the physical servo only supports 0–270°, this may cause servo strain. Verify on hardware.

8. **No error handling.** MakeCode JS does not surface servo driver errors. If the RobotBit is not powered separately, servos may not respond without any indication.
