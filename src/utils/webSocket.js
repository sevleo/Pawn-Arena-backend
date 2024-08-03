const WebSocket = require("ws");
const {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MAX_PLAYERS,
} = require("../config/gameConstants");
const createClientData = require("../models/clientData");
const { handleMessage } = require("../controllers/clientMessageController");
const { clients } = require("../services/gameStateService");
let { nextClientId } = require("../services/gameStateService");
const { Composite } = require("matter-js");

function setupWebSocket(server, world) {
  const wss = new WebSocket.Server({ server });
  console.log("Start Websocket server");

  wss.on("connection", (ws) => {
    // Assign clientId and clientData to new connection
    if (clients.size + 1 >= MAX_PLAYERS) {
      return;
    }

    const clientId = nextClientId++;
    const clientData = createClientData(ws, clientId, world);
    ws.clientData = clientData;

    // Add new connection to clients map
    clients.set(clientId, clientData);

    // First communication to client to let them know their clientId
    sendInitialData(ws, "initial position", clientId);

    ws.on("message", (message) => {
      handleMessage(message, clientData, world);
    });

    ws.on("close", () => {
      console.log(`Client ${clientId} disconnected`);
      clients.delete(clientId);
      Composite.remove(world, clientData.pawn.body);
    });

    ws.on("error", (error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
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

  return wss;
}

module.exports = setupWebSocket;
