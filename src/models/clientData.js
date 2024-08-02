const { createPawn } = require("./pawn");
const {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  RADIUS,
} = require("../config/gameConstants");

function createClientData(ws, clientId, world) {
  const { x, y } = generateRandomPosition(RADIUS);
  return {
    ws,
    clientId,
    pawn: createPawn(x, y, RADIUS, world, clientId),
    lastUpdate: Date.now(),
    moving: {
      movingRight: false,
      movingLeft: false,
      movingUp: false,
      movingDown: false,
    },
  };
}

function generateRandomPosition(radius) {
  // Generate random x and y positions, ensuring the pawn stays within canvas bounds
  const x = Math.random() * (CANVAS_WIDTH - radius);
  const y = Math.random() * (CANVAS_HEIGHT - radius);
  return { x, y };
}

module.exports = createClientData;
