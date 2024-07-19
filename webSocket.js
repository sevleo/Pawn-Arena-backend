const WebSocket = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  let nextClientId = 0; // Initialize a counter for client IDs
  const clients = new Map();
  let allPositions = [];

  wss.on("connection", (ws) => {
    // Assign clientId and clientData to new connection
    const clientId = nextClientId++;
    const clientData = { ws, position: { x: 200, y: 200 } };

    // Add new connection to clients map
    clients.set(clientId, clientData); // Store the WebSocket connection with its ID
    console.log("a user connected");
    console.log(clients);

    // Update allPositions array from clients map
    allPositions = Array.from(clients.entries()).map(([id, data]) => ({
      clientId: id,
      position: data.position,
    }));
    console.log(allPositions);

    // Send the initial position of the new connection to the client
    ws.send(
      JSON.stringify({
        type: "initial position",
        data: {
          position: clientData.position,
          clientId: clientId,
          allPositions: allPositions,
        },
      })
    );

    // Broadcast the updated position to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "position", data: allPositions }));
      }
    });

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

        // Update allPositions array from clients map
        allPositions = Array.from(clients.entries()).map(([id, data]) => ({
          clientId: id,
          position: data.position,
        }));
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
