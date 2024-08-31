const { BULLET_SPEED } = require("../config/gameConstants");

class Bullet {
  constructor(entity_id, position, direction) {
    this.entity_id = entity_id;
    this.position = {
      x: position.x,
      y: position.y,
    };
    this.direction = {
      x: direction.x,
      y: direction.y,
    };
    this.speed = BULLET_SPEED;
  }

  updatePosition() {
    this.position.x +=
      (this.direction.x /
        Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2)) *
      this.speed;
    this.position.y +=
      (this.direction.y /
        Math.sqrt(this.direction.x ** 2 + this.direction.y ** 2)) *
      this.speed;
  }
}

module.exports = Bullet;
