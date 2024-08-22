const { MOVEMENT_SPEED } = require("../config/gameConstants");

class Entity {
  constructor(clientId) {
    this.clientId = clientId;
    this.position = {
      x: 0,
      y: 0,
    };

    this.speed = MOVEMENT_SPEED;
    this.position_buffer = [];
  }

  applyInput(input) {
    switch (input.direction) {
      case "right":
        this.position.x += input.press_time * this.speed;
        break;
      case "left":
        this.position.x -= input.press_time * this.speed;
        break;
      case "up":
        this.position.y -= input.press_time * this.speed;
        break;
      case "down":
        this.position.y += input.press_time * this.speed;
        break;
    }
  }
}

module.exports = Entity;
