require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const {
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

// setUpdateGameStateInterval();
// setBroadcastGameStateInterval(webSocket);

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening at port ${PORT}...`);
});

// Game logic
let nextClientId = 0;
const clients = [];
const entities = [];
let last_processed_input = {};
let update_interval = null;

const messages = [];

const webSocket = setupWebSocket(server);

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  console.log("Start Websocket server");

  setServerUpdate(wss);

  wss.on("connection", (ws) => {
    const clientId = nextClientId++;
    ws.clientId = clientId;
    console.log(`Client ${clientId} connected`);
    const client = new Client(ws, clientId);
    clients.push(client);

    const entity = new Entity(clientId);
    entities.push(entity);

    // Send the entity_id to the client
    ws.send(JSON.stringify({ type: "connection", entity_id: clientId }));

    console.log(clients);
    console.log(entities);

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        switch (data.type) {
          case "input":
            data.data.entity_id = ws.clientId;
            messages.push({ recv_ts: Date.now(), payload: data.data });
            console.log(data);
            break;
        }
      } catch (err) {
        console.error(err);
      }
    });

    ws.on("close", () => {
      // Remove the client from the clients array
      const clientIndex = clients.findIndex(
        (client) => client.clientId === clientId
      );
      if (clientIndex !== -1) {
        clients.splice(clientIndex, 1);
      }

      // Remove the entity associated with the client from the entities array
      const entityIndex = entities.findIndex(
        (entity) => entity.clientId === clientId
      );
      if (entityIndex !== -1) {
        entities.splice(entityIndex, 1);
      }
    });
  });

  return wss;
}

// Broadcast the updated position to all clients
function setServerUpdate(wss) {
  try {
    console.log(wss);
    // Game loop to update and broadcast game state
    if (update_interval) {
      clearInterval(update_interval);
    }
    update_interval = setInterval(() => {
      // Listen to clients.
      processClientMessages();
      sendWorldState(wss);
    }, 200); // 60 FPS
  } catch (err) {
    console.error(err);
  }
}

// function processClientMessages() {
//   let message = getMessage();
//   if (message) {
//     // Update the state of the entity, based on its input.
//     // We just ignore inputs that don't look valid; this is what prevents clients from cheating.
//     if (validateInput(message)) {
//       const id = message.entity_id;
//       entities.forEach((entity) => {
//         if (entity.clientId === message.entity_id) {
//           entity.applyInput(message);
//           last_processed_input[id] = message.input_sequence_number;
//         }
//       });
//     }
//   }
// }
function processClientMessages() {
  while (messages.length > 0) {
    // console.log(JSON.stringify(messages));
    let message = getMessage();
    if (message && validateInput(message)) {
      // console.log(message);
      const id = message.entity_id;
      const entity = entities.find((entity) => entity.clientId === id);
      if (entity) {
        entity.applyInput(message);
        last_processed_input[id] = message.input_sequence_number;
        // console.log(last_processed_input);
      }
    }
  }
}

function sendWorldState(wss) {
  // Send the world state to all the connected clients.
  // console.log(wss);
  let world_state = entities.map((entity) => {
    return {
      entity_id: entity.clientId,
      position: entity.x,
      last_processed_input: last_processed_input[entity.clientId] || null,
    };
  });

  const worldStateMessage = JSON.stringify({
    type: "world_state",
    data: world_state,
  });

  wss.clients.forEach((client) => {
    client.send(worldStateMessage);
  });
}

// Check whether this input seems to be valid (e.g. "make sense" according
// to the physical rules of the World)
function validateInput(input) {
  if (Math.abs(input.press_time) > 1 / 40) {
    return false;
  }
  return true;
}

function getMessage() {
  const now = Date.now();
  for (let i = 0; i < messages.length; i++) {
    // Access each message in the queue.
    const message = messages[i];
    // // Check if the message's designated reception time has passed or is equal to the current time.
    if (message.recv_ts <= now) {
      messages.splice(i, 1);
      return message.payload;
    }
  }
}

// Update game state - update position of pawns
function setUpdateGameStateInterval() {
  setInterval(() => {
    clients.forEach((clientData) => {
      clientData.pawn.move(clientData);
    });
  }, GAME_SPEED_RATE);
}

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

class Client {
  constructor(ws, clientId) {
    this.ws = ws;
    this.clientId = clientId;
  }
}
