const WebSocket = require("ws");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  let nextClientId = 0; // Initialize a counter for client IDs
  const clients = new Map();

  var position = {
    x: 200,
    y: 200,
  };

  wss.on("connection", (ws) => {
    const clientId = nextClientId++;
    clients.set(clientId, ws); // Store the WebSocket connection with its ID
    console.log("a user connected");
    console.log(clients);

    // Send the current position to the newly connected client
    ws.send(JSON.stringify({ type: "position", data: position }));

    ws.on("message", (message) => {
      const msg = JSON.parse(message);

      if (msg.type === "move") {
        switch (msg.data) {
          case "left":
            position.x -= 5;
            break;
          case "right":
            position.x += 5;
            break;
          case "up":
            position.y -= 5;
            break;
          case "down":
            position.y += 5;
            break;
        }
      }

      // Broadcast the updated position to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "position", data: position }));
        }
      });
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
