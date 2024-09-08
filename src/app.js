require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");
const setupWebSocket = require("./ws/webSocket");
const { Engine } = require("matter-js");
const { createWorld } = require("./services/createWorld");
const { handleCollisions } = require("./services/collisionHandler");

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

handleCollisions(engine, world, webSocket);
