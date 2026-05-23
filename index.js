// BASIC CONFIGURATION, our servo motors can rotate between 0 and 220 degrees, so we set these
// as our minimum and maximum angles for the robot's legs to move.
const MIN_ANGLE = 10
const QUATER_ANGLE = 55
const NEUTRAL_ANGLE = 110
const THREE_QUARTER_ANGLE = 165
const MAX_ANGLE = 210

// SERVO ALIASES — map semantic names to RobotBit servo IDs
const SHOULDER_FL = robotbit.Servos.S1  // Front-Left   Shoulder
const KNEE_FL     = robotbit.Servos.S2  // Front-Left   Knee
const SHOULDER_RL = robotbit.Servos.S3  // Rear-Left    Shoulder
const KNEE_RL     = robotbit.Servos.S4  // Rear-Left    Knee
const SHOULDER_RR = robotbit.Servos.S5  // Rear-Right   Shoulder
const KNEE_RR     = robotbit.Servos.S6  // Rear-Right   Knee
const SHOULDER_FR = robotbit.Servos.S7  // Front-Right  Shoulder
const KNEE_FR     = robotbit.Servos.S8  // Front-Right  Knee

showInitLightShow();
doReset();

basic.pause(500); doFrontLeftKneeUp();
basic.pause(500); doFrontLeftKneeDown();
basic.pause(500); doFrontLeftKneeStraight();

basic.pause(500); doRearLeftKneeUp();
basic.pause(500); doRearLeftKneeDown();
basic.pause(500); doRearLeftKneeStraight();

basic.pause(500); doRearRightKneeUp();
basic.pause(500); doRearRightKneeDown();
basic.pause(500); doRearRightKneeStraight();

basic.pause(500); doFrontRightKneeUp();
basic.pause(500); doFrontRightKneeDown();
basic.pause(500); doFrontRightKneeStraight();

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
  stepForward(200)
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

basic.forever(function () {

})

function showInitLightShow() {
  let strip = robotbit.rgb()
  let red = neopixel.hsl(0, 100, 1)
  let off = 0
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

function stepForward(step: number) {
  /*
    Here is the complete gait cycle (walk gait) for the four-legged robot, using your formatting and standard naming conventions:

    Terminology:
    FL: Front Left
    FR: Front Right
    BL: Back Left
    BR: Back Right

    Order:
    KNEE_BL flexes (lifts the leg)
    SHOULDER_BL moves forward
    KNEE_BL extends (places the leg back on the ground)
    KNEE_FL flexes (lifts the leg)
    SHOULDER_FL moves forward
    KNEE_FL extends (places the leg back on the ground)
    KNEE_BR flexes (lifts the leg)
    SHOULDER_BR moves forward
    KNEE_BR extends (places the leg back on the ground)
    KNEE_FR flexes (lifts the leg)
    SHOULDER_FR moves forward
    KNEE_FR extends (places the leg back on the ground)

    Mechanical Note: While one specific leg is executing its lift-and-swing steps, the shoulders of the other three legs
    currently planted on the ground must smoothly move backward in unison. This simultaneous stance phase is what actually
    pushes the robot's chassis forward.
   */
  
}

function stepForwardV2(speed: number) {
  // move RL knee up, RL shoulder forward, RL knee down, RL shoulder back
  robotbit.Servo(KNEE_RL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_FR, NEUTRAL_ANGLE)
  basic.pause(speed)
  robotbit.Servo(SHOULDER_RL, MIN_ANGLE)
  robotbit.Servo(SHOULDER_FR, NEUTRAL_ANGLE)
  basic.pause(speed)
  robotbit.Servo(KNEE_RL, MAX_ANGLE)
  robotbit.Servo(KNEE_FR, MAX_ANGLE)
  basic.pause(speed)
  robotbit.Servo(SHOULDER_RL, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_FR, MIN_ANGLE)
  basic.pause(speed)

  // move FL knee up, FL shoulder forward, FL knee down, FL shoulder back
  robotbit.Servo(KNEE_FL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RR, NEUTRAL_ANGLE)
  basic.pause(speed)
  robotbit.Servo(SHOULDER_FL, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RR, MAX_ANGLE)
  basic.pause(speed)
  robotbit.Servo(KNEE_FL, MIN_ANGLE)
  robotbit.Servo(KNEE_RR, MIN_ANGLE)
  basic.pause(speed)
  robotbit.Servo(SHOULDER_FL, MAX_ANGLE)
  robotbit.Servo(SHOULDER_RR, NEUTRAL_ANGLE)
  basic.pause(speed)
}

function stepForwardV1(speed: number) {
  robotbit.Servo(KNEE_FL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RR, NEUTRAL_ANGLE)
  basic.pause(speed)
  robotbit.Servo(SHOULDER_FL, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RR, MAX_ANGLE)
  basic.pause(speed)
  robotbit.Servo(KNEE_FL, MIN_ANGLE)
  robotbit.Servo(KNEE_RR, MIN_ANGLE)
  basic.pause(speed)
  robotbit.Servo(SHOULDER_FL, MAX_ANGLE)
  robotbit.Servo(SHOULDER_RR, NEUTRAL_ANGLE)
  basic.pause(speed)

  robotbit.Servo(KNEE_FR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RL, NEUTRAL_ANGLE)
  basic.pause(speed)
  robotbit.Servo(SHOULDER_FR, NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RL, MIN_ANGLE)
  basic.pause(speed)
  robotbit.Servo(KNEE_FR, MAX_ANGLE)
  robotbit.Servo(KNEE_RL, MAX_ANGLE)
  basic.pause(speed)
  robotbit.Servo(SHOULDER_FR, MIN_ANGLE)
  robotbit.Servo(SHOULDER_RL, NEUTRAL_ANGLE)
  basic.pause(speed)
}

// --- Atomic joint action functions ---
// Knees: "down" = leg extended (standing), "straight" = NEUTRAL_ANGLE, "up" = leg lifted
// Shoulders: "forward" = leg swings forward, "straight" = NEUTRAL_ANGLE, "back" = leg swings back
// FL/RR knees: down=MIN_ANGLE, up=MAX_ANGLE
// FR/RL knees: down=MAX_ANGLE, up=MIN_ANGLE  (servos are mirrored on right side)
// FL/RR shoulders: forward=MAX_ANGLE, back=MIN_ANGLE
// FR/RL shoulders: forward=MIN_ANGLE, back=MAX_ANGLE
function doFrontLeftShoulderForward()     { robotbit.Servo(SHOULDER_FL, MIN_ANGLE) }
function doFrontLeftShoulderStraight()    { robotbit.Servo(SHOULDER_FL, NEUTRAL_ANGLE) }
function doFrontLeftShoulderBackward()    { robotbit.Servo(SHOULDER_FL, MAX_ANGLE) }

function doRearLeftShoulderForward()      { robotbit.Servo(SHOULDER_RL, MIN_ANGLE) }
function doRearLeftShoulderStraight()     { robotbit.Servo(SHOULDER_RL, NEUTRAL_ANGLE) }
function doRearLeftShoulderBackward()     { robotbit.Servo(SHOULDER_RL, MAX_ANGLE) }

function doRearRightShoulderForward()     { robotbit.Servo(SHOULDER_RR, MAX_ANGLE) }
function doRearRightShoulderStraight()    { robotbit.Servo(SHOULDER_RR, NEUTRAL_ANGLE) }
function doRearRightShoulderBackward()    { robotbit.Servo(SHOULDER_RR, MIN_ANGLE) }

function doFrontRightShoulderForward()    { robotbit.Servo(SHOULDER_FR, MAX_ANGLE) }
function doFrontRightShoulderStraight()   { robotbit.Servo(SHOULDER_FR, NEUTRAL_ANGLE) }
function doFrontRightShoulderBackward()   { robotbit.Servo(SHOULDER_FR, MIN_ANGLE) }

function doFrontLeftKneeUp()              { robotbit.Servo(KNEE_FL, MAX_ANGLE) }
function doFrontLeftKneeStraight()        { robotbit.Servo(KNEE_FL, NEUTRAL_ANGLE) }
function doFrontLeftKneeDown()            { robotbit.Servo(KNEE_FL, MIN_ANGLE) }

function doRearLeftKneeUp()               { robotbit.Servo(KNEE_RL, MIN_ANGLE) }
function doRearLeftKneeStraight()         { robotbit.Servo(KNEE_RL, NEUTRAL_ANGLE) }
function doRearLeftKneeDown()             { robotbit.Servo(KNEE_RL, MAX_ANGLE) }

function doFrontRightKneeUp()             { robotbit.Servo(KNEE_FR, MIN_ANGLE) }
function doFrontRightKneeStraight()       { robotbit.Servo(KNEE_FR, NEUTRAL_ANGLE) }
function doFrontRightKneeDown()           { robotbit.Servo(KNEE_FR, MAX_ANGLE) }

function doRearRightKneeUp()              { robotbit.Servo(KNEE_RR, MAX_ANGLE) }
function doRearRightKneeStraight()        { robotbit.Servo(KNEE_RR, NEUTRAL_ANGLE) }
function doRearRightKneeDown()            { robotbit.Servo(KNEE_RR, MIN_ANGLE) }

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
  robotbit.Servo(KNEE_FL,     NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RL,     NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RR,     NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_FR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_FR,     NEUTRAL_ANGLE)
}

function showGreenLed() {
  robotbit.rgb().showColor(neopixel.hsl(120, 74, 1))
}
function showLegsLed() {
  robotbit.rgb().showColor(neopixel.hsl(0, 0, 0))
}
function showRedLed() {
  robotbit.rgb().showColor(neopixel.hsl(0, 100, 1))
}
function showYellowLed() {
  robotbit.rgb().showColor(neopixel.hsl(120, 74, 1))
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
