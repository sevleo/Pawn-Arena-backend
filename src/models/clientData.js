const { MOVEMENT_SPEED } = require("../config/gameConstants");
const { createCircle } = require("./circle");

function createClientData(ws) {
  return {
    ws,
    circle: createCircle(100, 100, 10),
    direction: {
      directionX: 0,
      directionY: 0,
    },
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
