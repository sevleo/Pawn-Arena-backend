const {
  BULLET_SPEED,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} = require("../config/gameConstants");
const { Bodies, Composite, Body } = require("matter-js");
const { bullets, removedBullets } = require("../services/gameState");

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

  updatePosition(world) {
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

    if (
      this.serverPosition.x < 0 ||
      this.serverPosition.x > CANVAS_WIDTH ||
      this.serverPosition.y < 0 ||
      this.serverPosition > CANVAS_HEIGHT
    ) {
      Composite.remove(world, this.bulletBody);
      bullets.delete(this.bullet_id);
      removedBullets.set(this.bullet_id, this);
    }
  }
}

module.exports = Bullet;
