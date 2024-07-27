const { MOVEMENT_SPEED } = require("../gameConstants");

function createClientData(ws) {
  return {
    ws,
    position: { x: 200, y: 200 },
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
