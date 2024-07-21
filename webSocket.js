const WebSocket = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  let nextClientId = 0; // Initialize a counter for client IDs
  const clients = new Map();

  const RATE_LIMIT_INTERVAL = 20; // Rate limit interval in milliseconds (approximately 60 updates per second)
  const SPEED = 8;

  wss.on("connection", (ws) => {
    // Assign clientId and clientData to new connection
    const clientId = nextClientId++;
    const clientData = {
      ws,
      position: { x: 200, y: 200 },
      lastUpdate: Date.now(),
    };

    // Add new connection to clients map
    clients.set(clientId, clientData); // Store the WebSocket connection with its ID
    console.log("a user connected");
    console.log(clients);

    sendPosition(ws, "initial position");
    broadcastPositions();

    ws.on("message", (message) => {
      const msg = JSON.parse(message);
      const now = Date.now();
      try {
        if (msg.type === "move") {
          const clientData = clients.get(clientId);
          if (clientData) {
            // Throttle updates based on RATE_LIMIT_INTERVAL
            if (now - clientData.lastUpdate >= RATE_LIMIT_INTERVAL) {
              switch (msg.data) {
                case "left":
                  clientData.position.x -= SPEED;
                  break;
                case "right":
                  clientData.position.x += SPEED;
                  break;
                case "up":
                  clientData.position.y -= SPEED;
                  break;
                case "down":
                  clientData.position.y += SPEED;
                  break;
              }
              clientData.lastUpdate = now;
            }
          }
        }

        broadcastPositions();
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
    ws.on("close", () => {
      console.log("user disconnected");
      clients.delete(clientId);
      console.log(clients);
    });

    // Broadcast the updated position to all clients
    function broadcastPositions() {
      wss.clients.forEach((client) => {
        sendPosition(client, "position");
      });
    }

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
  });

  return wss;
}

module.exports = setupWebSocket;
