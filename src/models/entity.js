const { MOVEMENT_SPEED, BULLET_COOLDOWN } = require("../config/gameConstants");
const { Bodies, Composite, Body } = require("matter-js");
const Bullet = require("./bullet");
const { bullets } = require("../services/gameState");

class Entity {
  constructor(clientId, world) {
    this.clientId = clientId;
    this.position = {
      x: 0,
      y: 0,
    };
    this.faceDirection = {
      x: 0,
      y: 0,
    };
    this.speed = MOVEMENT_SPEED;
    this.lastBulletTimestamp = null;

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
    // Update position
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
      this.position.x += xForce;
      this.position.y += yForce;
      // Apply force to the body
      // Body.applyForce(this.entityBody, this.entityBody.position, {
      //   x: xForce,
      //   y: yForce,
      // });
      Body.setPosition(this.entityBody, {
        x: this.position.x,
        y: this.position.y,
      });

      // }
    }

    // Update direction
    this.faceDirection.x = input.faceDirection.x;
    this.faceDirection.y = input.faceDirection.y;

    // Create bullet
    if (input.active_keys.space) {
      const currentTimestamp = Date.now();

      if (
        this.lastBulletTimestamp === null || // No bullets have been fired yet
        currentTimestamp - this.lastBulletTimestamp >= BULLET_COOLDOWN // 200ms cooldown
      ) {
        const bullet = new Bullet(
          this.clientId,
          this.position,
          this.faceDirection,
          bullets.length
        );

        bullets.push(bullet);
        this.lastBulletTimestamp = currentTimestamp; // Update the last bullet timestamp
      }
    }
  }
}

module.exports = Entity;
