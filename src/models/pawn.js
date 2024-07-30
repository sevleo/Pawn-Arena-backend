const { Bodies, Composite, Body } = require("matter-js");
const { CANVAS_WIDTH, CANVAS_HEIGHT } = require("../config/gameConstants");

function createPawn(x, y, radius, world) {
  console.log(world);
  const pawnBody = Bodies.circle(x, y, radius, {
    isStatic: false,
    restitution: 0.5,
    friction: 0.1,
    frictionAir: 0.01,
  });

  Composite.add(world, pawnBody);

  return {
    body: pawnBody,
    radius,
    bulletConfig: {
      bulletRadius: 3,
      bulletWidth: 1,
      bulletHeight: 4,
    },
    move(clientData) {
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

      // const newX = this.x + xChange;
      // const newY = this.y + yChange;

      // const boundedPosition = getBoundedPosition(newX, newY);

      // this.x = boundedPosition.x;
      // this.y = boundedPosition.y;

      Body.setVelocity(this.body, {
        x: xChange,
        y: yChange,
      });
    },
  };
}

module.exports = {
  createPawn,
};
