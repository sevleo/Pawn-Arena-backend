const WebSocket = require("ws");
const { BROADCAST_RATE_INTERVAL } = require("./gameConstants");
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

    // Add new connection to clients map
    clients.set(clientId, clientData); // Store the WebSocket connection with its ID
    console.log("a user connected");
    console.log(clients);

    sendPosition(ws, "initial position"); // First communication to client to let them know their clientId
    setInterval(broadcastPositions, BROADCAST_RATE_INTERVAL); // Regular interval to broadcast positions

    ws.on("message", (message) => {
      handleGameMessage(JSON.parse(message), clientData);
    });

    ws.on("close", () => {
      console.log("user disconnected");
      clients.delete(clientId);
      console.log(clients);
    });

    // Broadcast the updated position to a specific client
    function sendPosition(client, type) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: type,
            data: {
              position: clientData.position,
              clientId: clientId,
              allPositions: Array.from(clients.entries()).map(([id, data]) => ({
                clientId: id,
                position: data.position,
              })),
            },
          })
        );
      }
    }

    // Broadcast the updated position to all clients
    function broadcastPositions() {
      ws.send(
        JSON.stringify({
          type: "position",
          data: {
            allPositions: Array.from(clients.entries()).map(([id, data]) => ({
              clientId: id,
              position: data.position,
            })),
          },
        })
      );
    }
  });

  return wss;
}

module.exports = setupWebSocket;
