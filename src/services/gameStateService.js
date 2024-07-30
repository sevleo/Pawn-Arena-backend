const {
  GAME_SPEED_RATE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BULLET_SPEED,
  BULLET_MAX_DISTANCE,
} = require("../config/gameConstants");

const clients = new Map();
const bullets = [];
let nextClientId = 0;

// Updates position of pawns
function updatePawns() {
  clients.forEach((clientData) => {
    clientData.pawn.move(clientData, CANVAS_WIDTH, CANVAS_HEIGHT);
  });
}

// Updates position of bullets
function updateBullets() {
  bullets.forEach((bullet, index) => {
    const magnitude = Math.sqrt(
      bullet.directionX ** 2 + bullet.directionY ** 2
    );
    bullet.x += (bullet.directionX / magnitude) * BULLET_SPEED;
    bullet.y += (bullet.directionY / magnitude) * BULLET_SPEED;
    bullet.distanceTravelled += BULLET_SPEED;

    // Remove bullets that are out of bounds or have travelled max distance
    if (
      bullet.distanceTravelled >= BULLET_MAX_DISTANCE ||
      bullet.x < 0 ||
      bullet.x > CANVAS_WIDTH ||
      bullet.y < 0 ||
      bullet.y > CANVAS_HEIGHT
    ) {
      bullets.splice(index, 1);
    }
  });
}

function updateGameState() {
  updatePawns();
  updateBullets();
}

function setUpdateGameStateInterval() {
  setInterval(updateGameState, GAME_SPEED_RATE);
}

module.exports = {
  nextClientId,
  clients,
  bullets,
  setUpdateGameStateInterval,
};
