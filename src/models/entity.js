const { MOVEMENT_SPEED } = require("../config/gameConstants");
const { Bodies, Composite, Body } = require("matter-js");

class Entity {
  constructor(clientId, world) {
    this.clientId = clientId;
    this.position = {
      x: 0,
      y: 0,
    };
    this.speed = MOVEMENT_SPEED;

    this.entityBody = Bodies.circle(0, 0, 10, {
      label: "entity",
      clientId: clientId,
      isStatic: false,
      restitution: 0,
      friction: 0.5,
      frictionAir: 0.5,
    });

    Composite.add(world, this.entityBody);
  }

  applyInput(input) {
    const xVelocity = input.active_keys.right
      ? this.speed
      : input.active_keys.left
      ? -this.speed
      : 0;
    const yVelocity = input.active_keys.up
      ? -this.speed
      : input.active_keys.down
      ? this.speed
      : 0;

    const currentVelocity = this.entityBody.velocity;
    const smoothingFactor = 0.1; // Adjust based on your needs

    Body.setVelocity(this.entityBody, {
      x:
        currentVelocity.x * (1 - smoothingFactor) + xVelocity * smoothingFactor,
      y:
        currentVelocity.y * (1 - smoothingFactor) + yVelocity * smoothingFactor,
    });
    // let xVelocity = 0;
    // let yVelocity = 0;
    // if (input.active_keys.right) xVelocity = this.speed * input.press_time;
    // if (input.active_keys.left) xVelocity = -this.speed * input.press_time;
    // if (input.active_keys.up) yVelocity = -this.speed * input.press_time;
    // if (input.active_keys.down) yVelocity = this.speed * input.press_time;
    // if (xVelocity !== 0 || yVelocity !== 0) {
    //   const diagonalFactor = 0.7071; // Approximation of 1/√2 for 45-degree movement
    //   if (xVelocity !== 0 && yVelocity !== 0) {
    //     xVelocity *= diagonalFactor;
    //     yVelocity *= diagonalFactor;
    //   }
    //   // Apply the velocity directly to the body
    //   Body.setVelocity(this.entityBody, {
    //     x: xVelocity,
    //     y: yVelocity,
    //   });
    // let xForce = 0;
    // let yForce = 0;
    // if (input.active_keys.right) xForce = this.speed * input.press_time;
    // if (input.active_keys.left) xForce = -this.speed * input.press_time;
    // if (input.active_keys.up) yForce = -this.speed * input.press_time;
    // if (input.active_keys.down) yForce = this.speed * input.press_time;
    // if (xForce !== 0 || yForce !== 0) {
    //   const diagonalFactor = 0.7071; // Approximation of 1/√2 for 45-degree movement
    //   if (xForce !== 0 && yForce !== 0) {
    //     xForce *= diagonalFactor;
    //     yForce *= diagonalFactor;
    //   }
    //   // Update the position of the entity
    //   this.position.x += xForce;
    //   this.position.y += yForce;
    // Apply force to the body
    // Body.applyForce(this.entityBody, this.entityBody.position, {
    //   x: xForce,
    //   y: yForce,
    // });
    // Body.setPosition(this.entityBody, {
    //   x: this.position.x,
    //   y: this.position.y,
    // });
    // }
  }
}

module.exports = Entity;
