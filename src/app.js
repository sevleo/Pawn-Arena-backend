require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  RADIUS,
  MOVEMENT_SPEED,
  GAME_SPEED_RATE,
  BROADCAST_RATE_INTERVAL,
} = require("./config/gameConstants");

// Setup infrastructure & run server
const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const webSocket = setupWebSocket(server);

console.log(webSocket);

setUpdateGameStateInterval();
setBroadcastGameStateInterval(webSocket);

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening at port ${PORT}...`);
});

// Game logic
const clients = new Map();
let nextClientId = 0;

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  console.log("Start Websocket server");

  wss.on("connection", (ws) => {
    const clientId = nextClientId++;
    const clientData = createClientData(ws, clientId);
    ws.clientData = clientData;

    console.log(`Client ${clientId} connected`);

    // Add new connection to clients map
    clients.set(clientId, clientData);

    ws.on("message", (message) => {
      const msg = JSON.parse(message);
      const { inputNumber, input } = msg.data;

      clientData.moving = {
        movingRight: input.includes("arrowright") || input.includes("d"),
        movingLeft: input.includes("arrowleft") || input.includes("a"),
        movingUp: input.includes("arrowup") || input.includes("w"),
        movingDown: input.includes("arrowdown") || input.includes("s"),
      };

      // Update the last processed sequence number
      clientData.lastProcessedServerInput = inputNumber;
    });

    ws.on("close", () => {
      console.log(`Client ${clientId} disconnected`);
      clients.delete(clientId);
    });
  });

  return wss;
}

function createClientData(ws, clientId) {
  const x = Math.random() * (CANVAS_WIDTH - RADIUS);
  const y = Math.random() * (CANVAS_HEIGHT - RADIUS);
  return {
    ws,
    clientId,
    pawn: createPawn(x, y, RADIUS, clientId),
    moving: {
      movingRight: false,
      movingLeft: false,
      movingUp: false,
      movingDown: false,
    },
    lastProcessedServerInput: 0,
    unprocessedInputs: [],
  };
}

function createPawn(x, y, radius, clientId) {
  return {
    position: { x, y },
    clientId: clientId,
    speed: MOVEMENT_SPEED,
    radius,
    move(clientData) {
      let xChange = 0;
      let yChange = 0;

      if (clientData.moving.movingRight) xChange = this.speed;
      if (clientData.moving.movingLeft) xChange = -this.speed;
      if (clientData.moving.movingUp) yChange = -this.speed;
      if (clientData.moving.movingDown) yChange = this.speed;

      if (xChange !== 0 || yChange !== 0) {
        const diagonalFactor = 0.7071;
        if (xChange !== 0 && yChange !== 0) {
          xChange *= diagonalFactor;
          yChange *= diagonalFactor;
        }

        this.position.x += xChange;
        this.position.y += yChange;
      }
    },
  };
}

// Update game state - update position of pawns
function setUpdateGameStateInterval() {
  setInterval(() => {
    clients.forEach((clientData) => {
      clientData.pawn.move(clientData);
    });
  }, GAME_SPEED_RATE);
}

// Broadcast the updated position to all clients
function setBroadcastGameStateInterval(wss) {
  setInterval(() => {
    const allPawns = Array.from(clients.entries()).map(([id, client]) => ({
      clientId: id,
      radius: client.pawn.radius,
      position: {
        x: client.pawn.position.x,
        y: client.pawn.position.y,
      },
      lastProcessedServerInput: client.lastProcessedServerInput,
    }));

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const data = {
          allPawns,
          clientPawn: {
            position: client.clientData?.pawn?.position,
          },
          lastProcessedServerInput: client.clientData.lastProcessedServerInput,
        };
        const message = JSON.stringify({ type: "gameState", data });
        client.send(message);
      }
    });
  }, BROADCAST_RATE_INTERVAL);
}
