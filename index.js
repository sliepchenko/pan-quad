input.onButtonPressed(Button.A, function () {
  useStateStand()
})
function showGreenLed () {
  robotbit.rgb().showColor(neopixel.hsl(120, 74, 1))
}
function showRedLed () {
  robotbit.rgb().showColor(neopixel.hsl(0, 100, 1))
}
function useStateTransportation () {
  robotbit.Servo(robotbit.Servos.S1, 90)
  robotbit.Servo(robotbit.Servos.S2, 180)
  robotbit.Servo(robotbit.Servos.S3, 90)
  robotbit.Servo(robotbit.Servos.S4, 0)
  robotbit.Servo(robotbit.Servos.S5, 270)
  robotbit.Servo(robotbit.Servos.S6, 180)
  robotbit.Servo(robotbit.Servos.S7, 270)
  robotbit.Servo(robotbit.Servos.S8, 0)
}
function showLegsLed () {
  robotbit.rgb().showColor(neopixel.hsl(0, 0, 0))
}
function showYellowLed () {
  robotbit.rgb().showColor(neopixel.hsl(120, 74, 1))
}
input.onButtonPressed(Button.AB, function () {

})
input.onButtonPressed(Button.B, function () {
  useStateTransportation()
})
function useStateStand () {
  robotbit.Servo(robotbit.Servos.S1, 45)
  robotbit.Servo(robotbit.Servos.S2, 90)
  robotbit.Servo(robotbit.Servos.S3, 135)
  robotbit.Servo(robotbit.Servos.S4, 90)
  robotbit.Servo(robotbit.Servos.S5, 225)
  robotbit.Servo(robotbit.Servos.S6, 90)
  robotbit.Servo(robotbit.Servos.S7, 315)
  robotbit.Servo(robotbit.Servos.S8, 90)
}
basic.forever(function () {

})
