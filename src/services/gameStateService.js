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

function updateMovement(clientData) {
  let xChange = 0;
  let yChange = 0;

  if (clientData.moving.movingRight) xChange = clientData.speed;
  if (clientData.moving.movingLeft) xChange = -clientData.speed;
  if (clientData.moving.movingUp) yChange = -clientData.speed;
  if (clientData.moving.movingDown) yChange = clientData.speed;

  if (xChange !== 0 && yChange !== 0) {
    const diagonalFactor = 0.7071;
    xChange *= diagonalFactor;
    yChange *= diagonalFactor;
  }

  clientData.circle.move(xChange, yChange, CANVAS_WIDTH, CANVAS_HEIGHT);
}

// Function to update bullet positions
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
  updateBullets();
  clients.forEach(updateMovement);
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
