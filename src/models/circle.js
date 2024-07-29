function createCircle(x, y, radius) {
  const position = createPosition(x, y, radius);
  return {
    position,
    radius,
    move(xChange, yChange, canvasWidth, canvasHeight) {
      position.update(xChange, yChange, canvasWidth, canvasHeight);
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
    update(xChange, yChange, canvasWidth, canvasHeight) {
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
  createCircle,
};
