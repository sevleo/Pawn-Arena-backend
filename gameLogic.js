const {
  MOVEMENT_SPEED,
  MOVEMENT_SPEED_BOOST,
  THROTTLING_INTERVAL,
  MOVEMENT_FREQUENCY_RATE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BULLET_SPEED,
  BULLET_MAX_DISTANCE,
} = require("./gameConstants");
const { clients, bullets } = require("./gameState");

function handleMove(msg, clientData) {
  const now = Date.now();
  if (now - clientData.lastUpdate >= THROTTLING_INTERVAL) {
    clientData.moving = {
      movingRight: msg.data.includes("arrowright") || msg.data.includes("d"),
      movingLeft: msg.data.includes("arrowleft") || msg.data.includes("a"),
      movingUp: msg.data.includes("arrowup") || msg.data.includes("w"),
      movingDown: msg.data.includes("arrowdown") || msg.data.includes("s"),
    };
    clientData.lastUpdate = now;
  }
}

function handleBoost(msg, clientData) {
  clientData.speed = msg.data ? MOVEMENT_SPEED_BOOST : MOVEMENT_SPEED;
}

function handleFaceDirectionUpdate(msg, clientData) {
  clientData.direction = msg.direction;
}

function handleBulletFire(clientData) {
  const bullet = {
    x: clientData.circle.position.x,
    y: clientData.circle.position.y,
    directionX: clientData.direction.directionX,
    directionY: clientData.direction.directionY,
    distanceTravelled: 0,
  };
  bullets.push(bullet);
}

function updateMovement(clientData) {
  // Define movement functions

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

function setUpdateInterval() {
  setInterval(updateGameState, MOVEMENT_FREQUENCY_RATE);
}

module.exports = {
  handleMove,
  handleBoost,
  handleFaceDirectionUpdate,
  handleBulletFire,
  setUpdateInterval,
};
