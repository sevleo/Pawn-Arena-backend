const { MOVEMENT_SPEED } = require("../config/gameConstants");

class Entity {
  constructor(clientId) {
    this.clientId = clientId;
    this.x = 3;
    this.speed = MOVEMENT_SPEED;
    this.position_buffer = [];
  }

  applyInput(input) {
    console.log(input);
    this.x += input.press_time * this.speed;
  }
}

module.exports = Entity;
