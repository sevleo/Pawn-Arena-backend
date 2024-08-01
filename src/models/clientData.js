const { MOVEMENT_SPEED } = require("../config/gameConstants");
const { createPawn } = require("./pawn");

function createClientData(ws, clientId, world) {
  return {
    ws,
    clientId,
    pawn: createPawn(100, 100, 10, world, clientId),
    lastUpdate: Date.now(),
    moving: {
      movingRight: false,
      movingLeft: false,
      movingUp: false,
      movingDown: false,
    },
  };
}

module.exports = createClientData;
