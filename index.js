showInitLightShow()

input.onLogoEvent(TouchButtonEvent.Pressed, function () {
  useStateReset()
})
input.onButtonPressed(Button.A, function () {
  useStateReset()
})
input.onButtonPressed(Button.AB, function () {
  useStateCrab()
})
input.onButtonPressed(Button.B, function () {
  useState135()
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
function useState135() {
  robotbit.Servo(robotbit.Servos.S1, 135)
  robotbit.Servo(robotbit.Servos.S2, 135)
  robotbit.Servo(robotbit.Servos.S3, 135)
  robotbit.Servo(robotbit.Servos.S4, 135)
  robotbit.Servo(robotbit.Servos.S5, 135)
  robotbit.Servo(robotbit.Servos.S6, 135)
  robotbit.Servo(robotbit.Servos.S7, 135)
  robotbit.Servo(robotbit.Servos.S8, 135)
}
function useStateCrab() {
  for (let angle = 0; angle <= 360; angle += 10) {
    robotbit.Servo(robotbit.Servos.S1, angle)
    robotbit.Servo(robotbit.Servos.S2, angle)
    robotbit.Servo(robotbit.Servos.S3, angle)
    robotbit.Servo(robotbit.Servos.S4, angle)
    robotbit.Servo(robotbit.Servos.S5, angle)
    robotbit.Servo(robotbit.Servos.S6, angle)
    robotbit.Servo(robotbit.Servos.S7, angle)
    robotbit.Servo(robotbit.Servos.S8, angle)
    basic.pause(500)
  }
}
function useStateReset() {
  robotbit.Servo(robotbit.Servos.S1, 45)
  robotbit.Servo(robotbit.Servos.S2, 45)
  robotbit.Servo(robotbit.Servos.S3, 45)
  robotbit.Servo(robotbit.Servos.S4, 45)
  robotbit.Servo(robotbit.Servos.S5, 45)
  robotbit.Servo(robotbit.Servos.S6, 45)
  robotbit.Servo(robotbit.Servos.S7, 45)
  robotbit.Servo(robotbit.Servos.S8, 45)
}
function useStateStand() {
  robotbit.Servo(robotbit.Servos.S1, 45)
  robotbit.Servo(robotbit.Servos.S2, 90)
  robotbit.Servo(robotbit.Servos.S3, 135)
  robotbit.Servo(robotbit.Servos.S4, 90)
  robotbit.Servo(robotbit.Servos.S5, 225)
  robotbit.Servo(robotbit.Servos.S6, 90)
  robotbit.Servo(robotbit.Servos.S7, 315)
  robotbit.Servo(robotbit.Servos.S8, 90)
}
