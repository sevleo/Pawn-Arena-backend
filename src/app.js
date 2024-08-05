require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");
const setupWebSocket = require("../src/utils/webSocket");
const { Engine } = require("matter-js");
const { setUpdateGameStateInterval } = require("./services/gameStateService");
const { setBroadcastGameStateInterval } = require("./utils/broadcastUtils");
const { createWorld } = require("./services/createWorld");
const { connectRedis, publisher, subscriber } = require("./utils/redisClient");

const {
  MAX_PLAYERS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} = require("./config/gameConstants");
const redis = require("redis");
const WebSocket = require("ws");
const { clients } = require("./services/gameStateService");
let { nextClientId } = require("./services/gameStateService");
const createClientData = require("./models/clientData");
const { Composite } = require("matter-js");
const { handleMessage } = require("./controllers/clientMessageController");

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

const websocket = new WebSocket.Server({ server });

(async () => {
  try {
    connectRedis();

    // Subscribe to the "gameEvents" channel and set up a listener
    await subscriber.subscribe("newPlayer", (message, channel) => {
      console.log(message);

      // Send the received message to all WebSocket connections
      websocket.clients.forEach((con) => con.send(message));
    });

    setUpdateGameStateInterval(engine, world);
    setBroadcastGameStateInterval(websocket);

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Listening at port ${PORT}...`);
    });

    websocket.on("connection", (ws) => {
      // Assign clientId and clientData to new connection
      if (clients.size + 1 >= MAX_PLAYERS) {
        return;
      }

      const clientId = nextClientId++;
      const clientData = createClientData(ws, clientId, world);
      ws.clientData = clientData;

      console.log(`Client ${clientId} connected`);

      // Add new connection to clients map
      clients.set(clientId, clientData);

      // First communication to client to let them know their clientId
      sendInitialData(ws, "initial position", clientId);

      publisher.publish(
        "newPlayer",
        JSON.stringify({
          clientId,
          clientData: {
            pawnPosition: clientData.pawn.body.position,
            pawnDirection: clientData.pawn.direction,
            pawnHealth: clientData.pawn.health,
          },
        })
      );

      ws.on("message", (message) => {
        // console.log(`Received message ${message.toString()}`);

        // Publish the received message to the "gameEvents" channel
        // publisher.publish("gameEvents", message.toString());

        handleMessage(message, clientData, world);
      });

      ws.on("close", () => {
        console.log(`Client ${clientId} disconnected`);
        clients.delete(clientId);
        Composite.remove(world, clientData.pawn.body);
      });
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
})();

function sendInitialData(client, type, clientId) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(
      JSON.stringify({
        type: type,
        data: {
          clientId: clientId,
          defaultMousePosition: {
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
          },
        },
      })
    );
  }
}

// const webSocket = setupWebSocket(server, world);
// Ensure Redis is connected before starting the server
// connectRedis()
//   .then(() => {
//     console.log(webSocket);

//     setUpdateGameStateInterval(engine, world);
//     setBroadcastGameStateInterval(webSocket);

//     const PORT = process.env.PORT || 3000;

//     // Start the HTTP server and listen on the specified port
//     server.listen(PORT, "0.0.0.0", () => {
//       console.log(`Listening at port ${PORT}...`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to start server:", err);
//   });
