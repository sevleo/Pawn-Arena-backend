require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");
const setupWebSocket = require("../src/utils/webSocket");
const { Engine } = require("matter-js");
const { setUpdateGameStateInterval } = require("./services/gameStateService");
const { setBroadcastGameStateInterval } = require("./utils/broadcastUtils");
const { createWorld } = require("./services/createWorld");
const redis = require("redis");

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

let connections = [];

const subscriber = redis.createClient({ port: 6379, host: "rds" });
const publisher = redis.createClient({ port: 6379, host: "rds" });

subscriber.connect();
publisher.connect();

subscriber.on("connect", () => {
  console.log("Subscriber connected to Redis");
});

publisher.on("connect", () => {
  console.log("Publisher connected to Redis");
});

subscriber.on("subscribe", function (channel, count) {
  console.log("Server subscribed successfully");
  publisher.publish("livechat", "a message");
});

subscriber.on("message", function (channel, message) {
  try {
    console.log(`Server received message in channel ${channel}`);
    connections.forEach((c) => c.send(message));
  } catch (ex) {
    console.log("Err:" + ex);
  }
});

subscriber.subscribe("livechat");

const webSocket = setupWebSocket(server, world, connections, publisher);

console.log(webSocket);
console.log(redis);
console.log(subscriber);
console.log(publisher);

setUpdateGameStateInterval(engine, world);
setBroadcastGameStateInterval(webSocket);

const PORT = process.env.PORT || 3000;

// Start the HTTP server and listen on the specified port
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening at port ${PORT}...`);
});
