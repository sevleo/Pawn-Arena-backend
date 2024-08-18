const WebSocket = require("ws");
const gameState = require("../services/gameState");
const {
  setBroadcastWorldStateInterval,
  getNewClientId,
} = require("../services/gameState");
const {
  setProcessClientMessagesInterval,
} = require("../services/clientMessages");
const handleClientMessage = require("../controllers/clientMessageController");
const Entity = require("../models/entity");
const Client = require("../models/client");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });
  console.log("Start Websocket server");

  // Loop to update the game state
  setProcessClientMessagesInterval();

  // Loop to broadcast the game state
  setBroadcastWorldStateInterval(wss);

  wss.on("connection", (ws) => {
    ws.clientId = getNewClientId();
    console.log(`Client ${ws.clientId} connected`);
    const client = new Client(ws);
    gameState.clients.push(client);

    const entity = new Entity(ws.clientId);
    gameState.entities.push(entity);

    // Send the entity_id to the client
    ws.send(JSON.stringify({ type: "connection", entity_id: ws.clientId }));

    console.log(gameState.clients);
    console.log(gameState.entities);

    ws.on("message", (message) => {
      handleClientMessage(message, ws);
    });

    ws.on("close", () => {
      // Remove the client from the clients array
      const clientIndex = gameState.clients.findIndex(
        (client) => client.clientId === ws.clientId
      );
      if (clientIndex !== -1) {
        gameState.clients.splice(clientIndex, 1);
      }

      // Remove the entity associated with the client from the entities array
      const entityIndex = gameState.entities.findIndex(
        (entity) => entity.clientId === ws.clientId
      );
      if (entityIndex !== -1) {
        gameState.entities.splice(entityIndex, 1);
      }

      console.log(`Client ${ws.clientId} disconnected`);
    });
  });

  return wss;
}

module.exports = setupWebSocket;
