const { MOVEMENT_SPEED } = require("../gameConstants");
const { createCircle } = require("./circle");

function createClientData(ws) {
  return {
    ws,
    circle: createCircle(100, 100, 20),
    lastUpdate: Date.now(),
    speed: MOVEMENT_SPEED,
    moving: {
      movingRight: false,
      movingLeft: false,
      movingUp: false,
      movingDown: false,
    },
    movementIntervalId: null,
  };
}

module.exports = createClientData;
