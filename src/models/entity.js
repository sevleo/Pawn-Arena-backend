class Entity {
  constructor(clientId) {
    this.clientId = clientId;
    this.x = 3;
    this.speed = 2;
    this.position_buffer = [];
  }

  applyInput(input) {
    this.x += input.press_time * this.speed;
  }
}

module.exports = Entity;
