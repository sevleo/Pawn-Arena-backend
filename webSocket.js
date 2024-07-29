const WebSocket = require("ws");
const {
  BROADCAST_RATE_INTERVAL,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} = require("./gameConstants");
const createClientData = require("./models/clientData");
const {
  handleMove,
  handleBoost,
  handleFaceDirectionUpdate,
  handleBulletFire,
  setUpdateInterval,
} = require("./gameLogic");
const { clients, bullets } = require("./gameState");
let { nextClientId } = require("./gameState");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    // Assign clientId and clientData to new connection
    const clientId = nextClientId++;
    const clientData = createClientData(ws);

    // Add new connection to clients map
    clients.set(clientId, clientData);

    // First communication to client to let them know their clientId
    sendInitialData(ws, "initial position");

    ws.on("message", (message) => {
      const msg = JSON.parse(message);
      switch (msg.type) {
        case "move":
          handleMove(msg, clientData);
          break;
        case "boost":
          handleBoost(msg, clientData);
          break;
        case "updateFaceDirection":
          handleFaceDirectionUpdate(msg, clientData);
          break;
        case "fireBullet":
          handleBulletFire(clientData);
          break;
      }
    });

    ws.on("close", () => {
      clients.delete(clientId);
    });

    // Broadcast the updated position to a specific client
    function sendInitialData(client, type) {
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
  });

  // Broadcast the updated position to all clients
  function broadcastGameState() {
    const allPositions = Array.from(clients.entries()).map(([id, client]) => ({
      clientId: id,
      radius: client.circle.radius,
      position: {
        x: client.circle.position.x,
        y: client.circle.position.y,
      },
      direction: client.direction,
    }));

    const message = JSON.stringify({
      type: "gameState",
      data: { allPositions, bullets },
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  setInterval(broadcastGameState, BROADCAST_RATE_INTERVAL); // Regular interval to broadcast positions
  setUpdateInterval();

  return wss;
}

module.exports = setupWebSocket;
