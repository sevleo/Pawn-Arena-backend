const { MOVEMENT_SPEED } = require("../config/gameConstants");
const { Bodies, Composite, Body } = require("matter-js");

class Entity {
  constructor(clientId, world) {
    this.clientId = clientId;
    this.position = {
      x: 0,
      y: 0,
    };
    this.speed = 0.02;

    this.entityBody = Bodies.circle(0, 0, 10, {
      label: "entity",
      clientId: clientId,
      isStatic: false,
      restitution: 0.2,
      friction: 0.5,
      frictionAir: 0.1,
    });

    Composite.add(world, this.entityBody);
  }

  applyInput(input) {
    let xForce = 0;
    let yForce = 0;

    if (input.active_keys.right) xForce = this.speed * input.press_time;
    if (input.active_keys.left) xForce = -this.speed * input.press_time;
    if (input.active_keys.up) yForce = -this.speed * input.press_time;
    if (input.active_keys.down) yForce = this.speed * input.press_time;

    if (xForce !== 0 || yForce !== 0) {
      const diagonalFactor = 0.7071; // Approximation of 1/√2 for 45-degree movement

      if (xForce !== 0 && yForce !== 0) {
        xForce *= diagonalFactor;
        yForce *= diagonalFactor;
      }

      // Update the position of the entity
      // this.position.x += xForce;
      // this.position.y += yForce;

      // Apply force to the body
      Body.applyForce(this.entityBody, this.entityBody.position, {
        x: xForce,
        y: yForce,
      });
    }
  }
}

module.exports = Entity;
