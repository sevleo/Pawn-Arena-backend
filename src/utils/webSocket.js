const WebSocket = require("ws");
const { CANVAS_WIDTH, CANVAS_HEIGHT } = require("../config/gameConstants");
const createClientData = require("../models/clientData");
const { setUpdateGameStateInterval } = require("../services/gameStateService");
const { handleMessage } = require("../controllers/clientMessageController");
const { clients } = require("../services/gameStateService");
const { setBroadcastGameStateInterval } = require("./broadcastUtils");
let { nextClientId } = require("../services/gameStateService");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    // Assign clientId and clientData to new connection
    const clientId = nextClientId++;
    const clientData = createClientData(ws, clientId);

    // Add new connection to clients map
    clients.set(clientId, clientData);

    // First communication to client to let them know their clientId
    sendInitialData(ws, "initial position", clientId);

    ws.on("message", (message) => {
      handleMessage(message, clientData);
    });

    ws.on("close", () => {
      clients.delete(clientId);
    });
  });

  // Broadcast the updated position to a specific client
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

  setUpdateGameStateInterval();
  setBroadcastGameStateInterval(wss);

  return wss;
}

module.exports = setupWebSocket;
