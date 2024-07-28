const WebSocket = require("ws");
const {
  BROADCAST_RATE_INTERVAL,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} = require("./gameConstants");
const createClientData = require("./models/clientData");

const handleGameMessage = require("./gameLogic");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  let nextClientId = 0; // Initialize a counter for client IDs
  const clients = new Map();

  wss.on("connection", (ws) => {
    // Assign clientId and clientData to new connection
    const clientId = nextClientId++;
    const clientData = createClientData(ws);

    console.log(clientData);

    // Add new connection to clients map
    clients.set(clientId, clientData); // Store the WebSocket connection with its ID
    console.log("a user connected");
    console.log(clients);

    sendInitialData(ws, "initial position"); // First communication to client to let them know their clientId

    ws.on("message", (message) => {
      const msg = JSON.parse(message);
      handleGameMessage(msg, clientData);
    });

    ws.on("close", () => {
      console.log("user disconnected");
      clients.delete(clientId);
      console.log(clients);
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
  function broadcastPositions() {
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
      type: "position",
      data: { allPositions },
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  setInterval(broadcastPositions, BROADCAST_RATE_INTERVAL); // Regular interval to broadcast positions

  return wss;
}

module.exports = setupWebSocket;
