require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");
const setupWebSocket = require("./ws/webSocket");
const { Engine, Events } = require("matter-js");
const { createWorld } = require("./services/createWorld");

// Run App server
const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening at port ${PORT}...`);
});

const engine = Engine.create();
const world = engine.world;
createWorld(engine, world);

// Run Websocket server
const webSocket = setupWebSocket(server, world, engine);

Events.on(engine, "collisionStart", function (event) {
  for (const pair of event.pairs) {
    if (
      pair.bodyA.label === "entity" &&
      pair.bodyB.label === "bullet" &&
      pair.bodyA.clientId !== pair.bodyB.clientId
    ) {
      console.log(
        `Bullet of entity ${pair.bodyB.clientId} has hit entity ${pair.bodyA.clientId}`
      );
    }
    if (
      pair.bodyA.label === "bullet" &&
      pair.bodyB.label === "entity" &&
      pair.bodyA.clientId !== pair.bodyB.clientId
    ) {
      console.log(
        `Bullet of entity ${pair.bodyA.clientId} has hit entity ${pair.bodyB.clientId}`
      );
    }
  }
});
