const WebSocket = require("ws");
const { getNewClientId } = require("../services/gameState");
const { setBroadcastWorldStateInterval } = require("../ws/broadcastData");
const {
  setProcessClientMessagesInterval,
} = require("../services/processClientMessages");
const handleClientMessage = require("./clientMessage");
const { createClient } = require("./clientConnect");
const { handleClientDisconnection } = require("./clientDisconnect");
const { createEntity } = require("../models/entity");

function setupWebSocket(server, world, engine) {
  const wss = new WebSocket.Server({ server });
  console.log("Start Websocket server");

  setProcessClientMessagesInterval(engine, world); // Loop to update the game state
  setBroadcastWorldStateInterval(wss); // Loop to broadcast the game state

  wss.on("connection", (ws) => {
    ws.clientId = getNewClientId();
    console.log(`Client ${ws.clientId} connected`);

    createClient(ws);
    // createEntity(ws, world);

    // Send the clientId to the client
    ws.send(JSON.stringify({ type: "connection", clientId: ws.clientId }));

    ws.on("message", (message) => {
      handleClientMessage(message, ws, world);
    });

    ws.on("close", () => {
      handleClientDisconnection(ws, world);
      const message = JSON.stringify({
        type: "disconnect",
        clientId: ws.clientId,
      });

      wss.clients.forEach((client) => {
        client.send(message);
      });
    });
  });

  return wss;
}

module.exports = setupWebSocket;
