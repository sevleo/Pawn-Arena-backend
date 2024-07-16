const WebSocket = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  let nextClientId = 0; // Initialize a counter for client IDs
  const clients = new Map();

  wss.on("connection", (ws) => {
    const clientId = nextClientId++;
    const clientData = { ws, position: { x: 200, y: 200 } };
    clients.set(clientId, clientData); // Store the WebSocket connection with its ID
    console.log("a user connected");
    console.log(clients);

    // Send the current position to the newly connected client
    ws.send(JSON.stringify({ type: "position", data: clientData.position }));

    ws.on("message", (message) => {
      const msg = JSON.parse(message);
      try {
        if (msg.type === "move") {
          switch (msg.data) {
            case "left":
              clientData.position.x -= 5;
              break;
            case "right":
              clientData.position.x += 5;
              break;
            case "up":
              clientData.position.y -= 5;
              break;
            case "down":
              clientData.position.y += 5;
              break;
          }
        }

        // Broadcast all clients' positions
        const allPositions = Array.from(clients.entries()).map(
          ([id, data]) => ({
            clientId: id,
            position: data.position,
          })
        );

        console.log(allPositions);

        // Broadcast the updated position to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({ type: "position", data: allPositions })
            );
          }
        });
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });
    ws.on("close", () => {
      console.log("user disconnected");
      clients.delete(clientId);
      console.log(clients);
    });
  });

  return wss;
}

module.exports = setupWebSocket;
