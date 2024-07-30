function createPawn(x, y, radius) {
  const position = createPosition(x, y, radius);
  return {
    position,
    radius,
    move(clientData, canvasWidth, canvasHeight) {
      position.update(clientData, canvasWidth, canvasHeight);
    },
  };
}

function createPosition(x, y, radius) {
  function getBoundedPosition(newX, newY, canvasWidth, canvasHeight) {
    if (newX - radius < 0) {
      newX = radius;
    }
    if (newX + radius > canvasWidth) {
      newX = canvasWidth - radius;
    }
    if (newY - radius < 0) {
      newY = radius;
    }
    if (newY + radius > canvasHeight) {
      newY = canvasHeight - radius;
    }
    return { x: newX, y: newY };
  }

  return {
    x,
    y,
    radius,
    update(clientData, canvasWidth, canvasHeight) {
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

      const boundedPosition = getBoundedPosition(
        newX,
        newY,
        canvasWidth,
        canvasHeight
      );

      this.x = boundedPosition.x;
      this.y = boundedPosition.y;
    },
  };
}

module.exports = {
  createPawn,
};
