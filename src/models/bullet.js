const { BULLET_SPEED } = require("../config/gameConstants");
const { Bodies, Composite, Body } = require("matter-js");

class Bullet {
  constructor(
    entity_id,
    position,
    direction,
    bullet_id,
    mousePosition,
    world,
    bullet_sequence_number
  ) {
    this.bullet_id = bullet_id;
    this.entity_id = entity_id;
    this.initialPosition = {
      x: position.x,
      y: position.y,
    };
    this.serverPosition = {
      x: position.x,
      y: position.y,
    };
    this.direction = {
      x: direction.x,
      y: direction.y,
    };
    this.speed = BULLET_SPEED;
    this.mousePosition = mousePosition;
    this.newBullet = true;
    this.bullet_sequence_number = bullet_sequence_number;

    this.bulletBody = Bodies.circle(0, 0, 1.5, {
      label: "bullet",
      clientId: entity_id,
      bulletId: bullet_id,
      isStatic: false,
      restitution: 0,
      friction: 0.5,
      frictionAir: 0.5,
    });

    Composite.add(world, this.bulletBody);
  }

  updatePosition() {
    this.serverPosition.x +=
      (this.direction.x /
        Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2)) *
      this.speed;
    this.serverPosition.y +=
      (this.direction.y /
        Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2)) *
      this.speed;

    Body.setPosition(this.bulletBody, {
      x: this.serverPosition.x,
      y: this.serverPosition.y,
    });
  }
}

module.exports = Bullet;
