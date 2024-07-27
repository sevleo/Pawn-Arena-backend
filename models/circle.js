function createCircle(x, y, radius) {
  const position = createPosition(x, y);
  const boundsChecker = createBoundsChecker(radius);

  return {
    position,
    radius,
    move(xChange, yChange, canvasWidth, canvasHeight) {
      position.update(xChange, yChange);
      boundsChecker.check(position, canvasWidth, canvasHeight);
    },
  };
}

function createPosition(x, y) {
  return {
    x,
    y,
    update(xChange, yChange) {
      this.x += xChange;
      this.y += yChange;
    },
  };
}

function createBoundsChecker(radius) {
  return {
    radius,
    check(position, canvasWidth, canvasHeight) {
      if (position.x - this.radius < 0) {
        position.x = this.radius;
      }
      if (position.x + this.radius > canvasWidth) {
        position.x = canvasWidth - this.radius;
      }
      if (position.y - this.radius < 0) {
        position.y = this.radius;
      }
      if (position.y + this.radius > canvasHeight) {
        position.y = canvasHeight - this.radius;
      }
    },
  };
}

module.exports = {
  createCircle,
};
