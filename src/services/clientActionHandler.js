const {
  MOVEMENT_SPEED,
  MOVEMENT_SPEED_BOOST,
  THROTTLING_INTERVAL,
} = require("../config/gameConstants");
const { bullets } = require("./gameStateService");

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

module.exports = {
  handleMove,
  handleBoost,
  handleFaceDirectionUpdate,
  handleBulletFire,
};
