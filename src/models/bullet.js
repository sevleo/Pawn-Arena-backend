const {
  BULLET_SPEED,
  BULLET_MAX_DISTANCE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} = require("../config/gameConstants");

function createBullet(clientData) {
  const position = createPosition(clientData);
  const clientId = clientData.clientId;
  const bulletRadius = clientData.pawn.bulletConfig.bulletRadius;
  const bulletWidth = clientData.pawn.bulletConfig.bulletWidth;
  const bulletHeight = clientData.pawn.bulletConfig.bulletHeight;

  return {
    position,
    clientId,
    bulletRadius,
    move(bullets, index) {
      position.update(bullets, index);
    },
  };
}

function createPosition(clientData) {
  let x = clientData.pawn.body.position.x;
  let y = clientData.pawn.body.position.y;
  let directionX = clientData.direction.directionX;
  let directionY = clientData.direction.directionY;
  let distanceTravelled = 0;

  return {
    x,
    y,
    directionX,
    directionY,
    distanceTravelled,
    update(bullets, index) {
      const magnitude = Math.sqrt(this.directionX ** 2 + this.directionY ** 2);
      this.x += (this.directionX / magnitude) * BULLET_SPEED;
      this.y += (this.directionY / magnitude) * BULLET_SPEED;
      this.distanceTravelled += BULLET_SPEED;

      // Remove bullets that are out of bounds or have travelled max distance
      if (
        this.distanceTravelled >= BULLET_MAX_DISTANCE ||
        this.x < 0 ||
        this.x > CANVAS_WIDTH ||
        this.y < 0 ||
        this.y > CANVAS_HEIGHT
      ) {
        bullets.splice(index, 1);
      }
    },
  };
}

module.exports = createBullet;
