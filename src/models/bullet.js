const { BULLET_SPEED } = require("../config/gameConstants");

class Bullet {
  constructor(entity_id, position, direction, bullet_id, mousePosition) {
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
  }
}

module.exports = Bullet;
