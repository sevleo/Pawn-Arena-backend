const { Composite, Bodies } = require("matter-js");

function createWorld(world, engine) {
  engine.gravity.x = 0;
  engine.gravity.y = 0;
}

module.exports = {
  createWorld,
};
