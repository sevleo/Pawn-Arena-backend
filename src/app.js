require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");
const setupWebSocket = require("../src/utils/webSocket");
const { Engine } = require("matter-js");
const { setUpdateGameStateInterval } = require("./services/gameStateService");
const { setBroadcastGameStateInterval } = require("./utils/broadcastUtils");
const { createWorld } = require("./services/createWorld");

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
createWorld(world, engine);

const webSocket = setupWebSocket(server, world);

console.log(webSocket);

setUpdateGameStateInterval(engine, world);
setBroadcastGameStateInterval(webSocket);

const PORT = process.env.PORT || 3000;

// Start the HTTP server and listen on the specified port
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening at port ${PORT}...`);
});
