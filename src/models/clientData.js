const { MOVEMENT_SPEED } = require("../config/gameConstants");
const { createPawn } = require("./pawn");

function createClientData(ws, clientId, world) {
  return {
    ws,
    clientId,
    pawn: createPawn(100, 100, 10, world),
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
  };
}

module.exports = createClientData;
