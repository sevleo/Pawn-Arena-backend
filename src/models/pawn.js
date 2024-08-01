const { Bodies, Composite, Body } = require("matter-js");
const { CANVAS_WIDTH, CANVAS_HEIGHT } = require("../config/gameConstants");

function createPawn(x, y, radius, world, clientId) {
  const pawnBody = Bodies.circle(x, y, radius, {
    label: "Pawn",
    isStatic: false,
    restitution: 0.2,
    friction: 0.5,
    frictionAir: 0.1,
    clientId: clientId,
  });

  Composite.add(world, pawnBody);

  return {
    body: pawnBody,
    radius,
    bulletConfig: {
      bulletRadius: 2,
      bulletWidth: 1,
      bulletHeight: 10,
    },
    move(clientData) {
      let xForce = 0;
      let yForce = 0;

      if (clientData.moving.movingRight) xForce = clientData.speed;
      if (clientData.moving.movingLeft) xForce = -clientData.speed;
      if (clientData.moving.movingUp) yForce = -clientData.speed;
      if (clientData.moving.movingDown) yForce = clientData.speed;

      if (xForce !== 0 || yForce !== 0) {
        const diagonalFactor = 0.7071;
        if (xForce !== 0 && yForce !== 0) {
          xForce *= diagonalFactor;
          yForce *= diagonalFactor;
        }

        // Apply force to the body
        Body.applyForce(this.body, this.body.position, {
          x: xForce,
          y: yForce,
        });
      }
    },
  };
}

module.exports = {
  createPawn,
};
