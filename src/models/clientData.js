const { MOVEMENT_SPEED } = require("../config/gameConstants");
const { createPawn } = require("./pawn");

function createClientData(ws) {
  return {
    ws,
    pawn: createPawn(100, 100, 10),
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
