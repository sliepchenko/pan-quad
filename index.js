// BASIC CONFIGURATION, our servo motors can rotate between 0 and 220 degrees, so we set these
// as our minimum and maximum angles for the robot's legs to move.
const MIN_ANGLE = 10
const QUARTER_ANGLE = 55
const NEUTRAL_ANGLE = 110
const THREE_QUARTER_ANGLE = 165
const MAX_ANGLE = 210

// SONAR DISTANCE CONSTANTS (centimetres)
// SONAR_OBSTACLE_THRESHOLD — distance above which the path is clear (LED green); at or below → LED red
const SONAR_OBSTACLE_SEE = 50
const SONAR_OBSTACLE_AVOID = 30

// COLOUR CONSTANTS — HSL values used for the NeoPixel LED strip
// _DIM variants are used for status-only indicators (low brightness); _BRIGHT for the obstacle LED
const COLOR_OFF = neopixel.hsl(0, 0, 0)
const COLOR_RED = neopixel.hsl(0, 100, 1)
const COLOR_GREEN = neopixel.hsl(120, 100, 1)

// SERVO ALIASES — map semantic names to RobotBit servo IDs
const SHOULDER_FL = robotbit.Servos.S1  // Front-Left   Shoulder
const KNEE_FL = robotbit.Servos.S2  // Front-Left   Knee
const SHOULDER_RL = robotbit.Servos.S3  // Rear-Left    Shoulder
const KNEE_RL = robotbit.Servos.S4  // Rear-Left    Knee
const SHOULDER_RR = robotbit.Servos.S5  // Rear-Right   Shoulder
const KNEE_RR = robotbit.Servos.S6  // Rear-Right   Knee
const SHOULDER_FR = robotbit.Servos.S7  // Front-Right  Shoulder
const KNEE_FR = robotbit.Servos.S8  // Front-Right  Knee

let busy = false;
let distance = 0;

showInitLightShow();

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
  doStepForward(200)
})
input.onButtonPressed(Button.A, function () {
  doLie()
})
input.onButtonPressed(Button.AB, function () {
  doReset();
})
input.onButtonPressed(Button.B, function () {
  doStay()
})

while (true) {
  distance = Math.floor((distance * 2 + sonar.ping(
    DigitalPin.P1,
    DigitalPin.P2,
    PingUnit.Centimeters
  )) / 3);

  showObstacleLed(distance)

  if (!busy) {
    busy = true;

    if (distance > SONAR_OBSTACLE_AVOID) {
      doStepForward(200)
    } else {
      doReset();
      doStay()
    }

    basic.pause(400);
    busy = false;
  }
}

function showInitLightShow() {
  let strip = robotbit.rgb()
  let red = COLOR_RED
  let off = COLOR_OFF

  // [0]
  strip.setPixelColor(0, red)
  strip.show()
  basic.pause(100)
  // [0, 1]
  strip.setPixelColor(0, red)
  strip.setPixelColor(1, red)
  strip.show()
  basic.pause(100)
  // [1, 2]
  strip.setPixelColor(0, off)
  strip.setPixelColor(1, red)
  strip.setPixelColor(2, red)
  strip.show()
  basic.pause(100)
  // [2, 3]
  strip.setPixelColor(1, off)
  strip.setPixelColor(2, red)
  strip.setPixelColor(3, red)
  strip.show()
  basic.pause(100)
  // [3]
  strip.setPixelColor(2, off)
  strip.setPixelColor(3, red)
  strip.show()
  basic.pause(100)
  // all off
  strip.setPixelColor(3, off)
  strip.show()
}

function doStay() {
  robotbit.Servo(SHOULDER_FL, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RL, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RR, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_FR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_FL, MIN_ANGLE)
  robotbit.Servo(KNEE_RL, MAX_ANGLE)
  robotbit.Servo(KNEE_RR, MIN_ANGLE)
  robotbit.Servo(KNEE_FR, MAX_ANGLE)
}

function doStepForward(step: number) {
  doFrontRightKneeStraight(); doRearLeftKneeStraight();
  basic.pause(step / 2);
  doFrontRightShoulderStraight(); doRearLeftShoulderForward();
  basic.pause(step / 2);
  doFrontRightKneeDown(); doRearLeftKneeDown();
  basic.pause(step / 2);
  doFrontRightShoulderBackward(); doRearLeftShoulderStraight();

  doFrontLeftKneeStraight(); doRearRightKneeStraight();
  basic.pause(step / 2);
  doFrontLeftShoulderStraight(); doRearRightShoulderForward();
  basic.pause(step / 2);
  doFrontLeftKneeDown(); doRearRightKneeDown();
  basic.pause(step / 2);
  doFrontLeftShoulderBackward(); doRearRightShoulderStraight();
}

// --- Atomic joint action functions ---
// Knees: "down" = leg extended (standing), "straight" = NEUTRAL_ANGLE, "up" = leg lifted
// Shoulders: "forward" = leg swings forward, "straight" = NEUTRAL_ANGLE, "back" = leg swings back
// FL/RR knees: down=MIN_ANGLE, up=MAX_ANGLE
// FR/RL knees: down=MAX_ANGLE, up=MIN_ANGLE  (servos are mirrored on right side)
// FL/RR shoulders: forward=MAX_ANGLE, back=MIN_ANGLE
// FR/RL shoulders: forward=MIN_ANGLE, back=MAX_ANGLE
function doFrontLeftShoulderForward() { robotbit.Servo(SHOULDER_FL, QUARTER_ANGLE) }
function doFrontLeftShoulderStraight() { robotbit.Servo(SHOULDER_FL, NEUTRAL_ANGLE) }
function doFrontLeftShoulderBackward() { robotbit.Servo(SHOULDER_FL, THREE_QUARTER_ANGLE) }

function doRearLeftShoulderForward() { robotbit.Servo(SHOULDER_RL, MIN_ANGLE) }
function doRearLeftShoulderStraight() { robotbit.Servo(SHOULDER_RL, QUARTER_ANGLE) }
function doRearLeftShoulderBackward() { robotbit.Servo(SHOULDER_RL, NEUTRAL_ANGLE) }

function doRearRightShoulderForward() { robotbit.Servo(SHOULDER_RR, MAX_ANGLE) }
function doRearRightShoulderStraight() { robotbit.Servo(SHOULDER_RR, THREE_QUARTER_ANGLE) }
function doRearRightShoulderBackward() { robotbit.Servo(SHOULDER_RR, NEUTRAL_ANGLE) }

function doFrontRightShoulderForward() { robotbit.Servo(SHOULDER_FR, THREE_QUARTER_ANGLE) }
function doFrontRightShoulderStraight() { robotbit.Servo(SHOULDER_FR, NEUTRAL_ANGLE) }
function doFrontRightShoulderBackward() { robotbit.Servo(SHOULDER_FR, QUARTER_ANGLE) }

function doFrontLeftKneeUp() { robotbit.Servo(KNEE_FL, MAX_ANGLE) }
function doFrontLeftKneeStraight() { robotbit.Servo(KNEE_FL, NEUTRAL_ANGLE) }
function doFrontLeftKneeDown() { robotbit.Servo(KNEE_FL, MIN_ANGLE) }

function doRearLeftKneeUp() { robotbit.Servo(KNEE_RL, MIN_ANGLE) }
function doRearLeftKneeStraight() { robotbit.Servo(KNEE_RL, NEUTRAL_ANGLE) }
function doRearLeftKneeDown() { robotbit.Servo(KNEE_RL, MAX_ANGLE) }

function doFrontRightKneeUp() { robotbit.Servo(KNEE_FR, MIN_ANGLE) }
function doFrontRightKneeStraight() { robotbit.Servo(KNEE_FR, NEUTRAL_ANGLE) }
function doFrontRightKneeDown() { robotbit.Servo(KNEE_FR, MAX_ANGLE) }

function doRearRightKneeUp() { robotbit.Servo(KNEE_RR, MAX_ANGLE) }
function doRearRightKneeStraight() { robotbit.Servo(KNEE_RR, NEUTRAL_ANGLE) }
function doRearRightKneeDown() { robotbit.Servo(KNEE_RR, MIN_ANGLE) }

function doStand() {
  robotbit.Servo(KNEE_FL, MIN_ANGLE)
  robotbit.Servo(KNEE_RL, MAX_ANGLE)
  robotbit.Servo(KNEE_RR, MIN_ANGLE)
  robotbit.Servo(KNEE_FR, MAX_ANGLE)
}
function doLie() {
  robotbit.Servo(KNEE_FL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_FR, NEUTRAL_ANGLE)
}
function doReset() {
  robotbit.Servo(SHOULDER_FL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_FL, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RL, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RR, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_FR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_FR, NEUTRAL_ANGLE)
}

function showGreenLed() {
  robotbit.rgb().showColor(COLOR_GREEN)
}
function showLegsLed() {
  robotbit.rgb().showColor(COLOR_OFF)
}
function showRedLed() {
  robotbit.rgb().showColor(COLOR_RED)
}
function showYellowLed() {
  robotbit.rgb().showColor(COLOR_GREEN)
}

// Diode 0: obstacle distance indicator
//   distance = 0         → off (no obstacle / out of range)
//   distance > threshold → green (path clear)
//   distance ≤ threshold → red (obstacle detected)
function showObstacleLed(distance: number) {
  let strip = robotbit.rgb()

  if (distance <= 0 || distance > SONAR_OBSTACLE_SEE) {
    strip.setPixelColor(0, COLOR_OFF)
  } else if (distance > SONAR_OBSTACLE_AVOID) {
    strip.setPixelColor(0, COLOR_GREEN)
  } else {
    strip.setPixelColor(0, COLOR_RED)
  }

  strip.show()
}

function useStateMaximumKnees() {
  robotbit.Servo(KNEE_FL, MAX_ANGLE)
  robotbit.Servo(KNEE_RL, MAX_ANGLE)
  robotbit.Servo(KNEE_RR, MAX_ANGLE)
  robotbit.Servo(KNEE_FR, MAX_ANGLE)
}
function useStateMaximumShoulders() {
  robotbit.Servo(SHOULDER_FL, MAX_ANGLE)
  robotbit.Servo(SHOULDER_RL, MAX_ANGLE)
  robotbit.Servo(SHOULDER_RR, MAX_ANGLE)
  robotbit.Servo(SHOULDER_FR, MAX_ANGLE)
}
function useStateMinimumKnees() {
  robotbit.Servo(KNEE_FL, MIN_ANGLE)
  robotbit.Servo(KNEE_RL, MIN_ANGLE)
  robotbit.Servo(KNEE_RR, MIN_ANGLE)
  robotbit.Servo(KNEE_FR, MIN_ANGLE)
}
function useStateMinimumShoulders() {
  robotbit.Servo(SHOULDER_FL, MIN_ANGLE)
  robotbit.Servo(SHOULDER_RL, MIN_ANGLE)
  robotbit.Servo(SHOULDER_RR, MIN_ANGLE)
  robotbit.Servo(SHOULDER_FR, MIN_ANGLE)
}