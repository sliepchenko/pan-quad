// BASIC CONFIGURATION, our servo motors can rotate between 0 and 220 degrees, so we set these
// as our minimum and maximum angles for the robot's legs to move.
const MIN_ANGLE = 0
const MAX_ANGLE = 220
const NEUTRAL_ANGLE = 110

// SERVO ALIASES — map semantic names to RobotBit servo IDs
const SHOULDER_FL = robotbit.Servos.S1  // Front-Left  Shoulder
const KNEE_FL     = robotbit.Servos.S2  // Front-Left  Knee
const SHOULDER_RL = robotbit.Servos.S3  // Front-Right Shoulder
const KNEE_RL     = robotbit.Servos.S4  // Front-Right Knee
const SHOULDER_RR = robotbit.Servos.S5  // Rear-Left   Shoulder
const KNEE_RR     = robotbit.Servos.S6  // Rear-Left   Knee
const SHOULDER_FR = robotbit.Servos.S7  // Rear-Right  Shoulder
const KNEE_FR     = robotbit.Servos.S8  // Rear-Right  Knee

showInitLightShow()

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
  useStateStand()
})
input.onButtonPressed(Button.A, function () {
  useStateMinimumShoulders()
})
input.onButtonPressed(Button.AB, function () {
  useStateReset();
})
input.onButtonPressed(Button.B, function () {
  useStateMaximumShoulders()
})

basic.forever(function () {
})

function showGreenLed() {
  robotbit.rgb().showColor(neopixel.hsl(120, 74, 1))
}
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
function showLegsLed() {
  robotbit.rgb().showColor(neopixel.hsl(0, 0, 0))
}
function showRedLed() {
  robotbit.rgb().showColor(neopixel.hsl(0, 100, 1))
}
function showYellowLed() {
  robotbit.rgb().showColor(neopixel.hsl(120, 74, 1))
}
function useStateCrab() {
  for (let angle = MIN_ANGLE; angle <= MAX_ANGLE; angle += 10) {
    robotbit.Servo(SHOULDER_FL, Math.min(Math.max(angle, MIN_ANGLE), MAX_ANGLE))
    robotbit.Servo(KNEE_FL,     Math.min(Math.max(angle, MIN_ANGLE), MAX_ANGLE))
    robotbit.Servo(SHOULDER_RL, Math.min(Math.max(angle, MIN_ANGLE), MAX_ANGLE))
    robotbit.Servo(KNEE_RL,     Math.min(Math.max(angle, MIN_ANGLE), MAX_ANGLE))
    robotbit.Servo(SHOULDER_RR, Math.min(Math.max(angle, MIN_ANGLE), MAX_ANGLE))
    robotbit.Servo(KNEE_RR,     Math.min(Math.max(angle, MIN_ANGLE), MAX_ANGLE))
    robotbit.Servo(SHOULDER_FR, Math.min(Math.max(angle, MIN_ANGLE), MAX_ANGLE))
    robotbit.Servo(KNEE_FR,     Math.min(Math.max(angle, MIN_ANGLE), MAX_ANGLE))
    basic.pause(500)
  }
}
function useStateLie() {
  robotbit.Servo(KNEE_FL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_FR, NEUTRAL_ANGLE)
  // KNEE_1, KNEE_2, KNEE_3, KNEE_4 (knees) are intentionally left untouched
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
function useStateReset() {
  robotbit.Servo(SHOULDER_FL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_FL,     NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RL, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RL,     NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_RR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_RR,     NEUTRAL_ANGLE)
  robotbit.Servo(SHOULDER_FR, NEUTRAL_ANGLE)
  robotbit.Servo(KNEE_FR,     NEUTRAL_ANGLE)
}
function useStateStand() {
  robotbit.Servo(KNEE_FL, MIN_ANGLE)
  robotbit.Servo(KNEE_RL, MAX_ANGLE)
  robotbit.Servo(KNEE_RR, MIN_ANGLE)
  robotbit.Servo(KNEE_FR, MAX_ANGLE)
}
