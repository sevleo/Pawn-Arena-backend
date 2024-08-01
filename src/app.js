const cors = require("cors");
const express = require("express");
const http = require("http");
const setupWebSocket = require("../src/utils/webSocket");
const { Engine, Composite, Bodies } = require("matter-js");
const { CANVAS_WIDTH, CANVAS_HEIGHT } = require("./config/gameConstants");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Initialize Matter.js engine and world
const engine = Engine.create();
const world = engine.world;

const BULLET_CATEGORY = 0x0001;
const WALL_CATEGORY = 0x0002;

// Add boundaries
Composite.add(world, [
  // Top boundary
  Bodies.rectangle(CANVAS_WIDTH / 2, -10, CANVAS_WIDTH, 20, {
    label: "Wall",
    isStatic: true,
    collisionFilter: {
      category: WALL_CATEGORY,
      mask: ~BULLET_CATEGORY,
    },
  }),

  // Bottom boundary
  Bodies.rectangle(CANVAS_WIDTH / 2, CANVAS_HEIGHT + 10, CANVAS_WIDTH, 20, {
    label: "Wall",
    isStatic: true,
  }),

  // Left boundary
  Bodies.rectangle(-10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, {
    label: "Wall",
    isStatic: true,
  }),

  // Right boundary
  Bodies.rectangle(CANVAS_WIDTH + 10, CANVAS_HEIGHT / 2, 20, CANVAS_HEIGHT, {
    label: "Wall",
    isStatic: true,
  }),
]);

engine.gravity.x = 0;
engine.gravity.y = 0;

console.log(engine);
console.log(world);

setupWebSocket(server, world, engine);
// setupSocketIo(server, corsOptions);

server.listen(3000, () => {
  console.log("Listening at :3000...");
});
