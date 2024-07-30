const { CANVAS_WIDTH, CANVAS_HEIGHT } = require("../config/gameConstants");

function createPawn(x, y, radius) {
  const position = createPosition(x, y, radius);
  return {
    position,
    radius,
    move(clientData) {
      position.update(clientData);
    },
  };
}

function createPosition(x, y, radius) {
  function getBoundedPosition(newX, newY) {
    if (newX - radius < 0) {
      newX = radius;
    }
    if (newX + radius > CANVAS_WIDTH) {
      newX = CANVAS_WIDTH - radius;
    }
    if (newY - radius < 0) {
      newY = radius;
    }
    if (newY + radius > CANVAS_HEIGHT) {
      newY = CANVAS_HEIGHT - radius;
    }
    return { x: newX, y: newY };
  }

  return {
    x,
    y,
    radius,
    update(clientData) {
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

      const newX = this.x + xChange;
      const newY = this.y + yChange;

      const boundedPosition = getBoundedPosition(newX, newY);

      this.x = boundedPosition.x;
      this.y = boundedPosition.y;
    },
  };
}

module.exports = {
  createPawn,
};
