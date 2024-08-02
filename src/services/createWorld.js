const { Composite, Bodies } = require("matter-js");

const {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BULLET_CATEGORY,
  WALL_CATEGORY,
  PAWN_CATEGORY,
} = require("../config/gameConstants");

function createWorld(world, engine) {
  // Add boundaries
  Composite.add(world, [
    // Top boundary
    Bodies.rectangle(CANVAS_WIDTH / 2, -10, CANVAS_WIDTH, 20, {
      label: "Wall",
      isStatic: true,
      collisionFilter: {
        category: WALL_CATEGORY,
      },
    }),

    // Bottom boundary
    Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 10, CANVAS_WIDTH, 20, {
      label: "Wall",
      isStatic: true,
      collisionFilter: {
        category: WALL_CATEGORY,
      },
    }),

    // Left boundary
    Bodies.rectangle(-10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, {
      label: "Wall",
      isStatic: true,
      collisionFilter: {
        category: WALL_CATEGORY,
      },
    }),

    // Right boundary
    Bodies.rectangle(CANVAS_WIDTH + 10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, {
      label: "Wall",
      isStatic: true,
      collisionFilter: {
        category: WALL_CATEGORY,
      },
    }),
  ]);

  engine.gravity.x = 0;
  engine.gravity.y = 0;
}

module.exports = {
  createWorld,
};
