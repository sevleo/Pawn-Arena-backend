const WebSocket = require("ws");
const { getNewClientId } = require("../services/gameState");
const { setBroadcastWorldStateInterval } = require("../ws/broadcastData");
const {
  setProcessClientMessagesInterval,
} = require("../services/processClientMessages");
const handleClientMessage = require("./clientMessage");
const { createClientAndEntity } = require("./clientConnect");
const { handleClientDisconnection } = require("./clientDisconnect");

function setupWebSocket(server, world, engine) {
  const wss = new WebSocket.Server({ server });
  console.log("Start Websocket server");
  console.log(world);

  setProcessClientMessagesInterval(engine, world); // Loop to update the game state
  setBroadcastWorldStateInterval(wss); // Loop to broadcast the game state

  wss.on("connection", (ws) => {
    ws.clientId = getNewClientId();
    console.log(`Client ${ws.clientId} connected`);
    createClientAndEntity(ws, world);

    // Send the entity_id to the client
    ws.send(JSON.stringify({ type: "connection", entity_id: ws.clientId }));

    ws.on("message", (message) => {
      handleClientMessage(message, ws);
    });

    ws.on("close", () => {
      handleClientDisconnection(ws, world);
      const message = JSON.stringify({
        type: "disconnect",
        entity_id: ws.clientId,
      });

      wss.clients.forEach((client) => {
        client.send(message);
      });
    });
  });

  return wss;
}

module.exports = setupWebSocket;
