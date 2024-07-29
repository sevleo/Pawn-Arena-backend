const WebSocket = require("ws");
const {
  BROADCAST_RATE_INTERVAL,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MOVEMENT_FREQUENCY_RATE,
  BULLET_SPEED,
  BULLET_MAX_DISTANCE,
} = require("./gameConstants");
const createClientData = require("./models/clientData");
const handleGameMessage = require("./gameLogic");

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  let nextClientId = 0; // Initialize a counter for client IDs
  const clients = new Map();
  const bullets = [];

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
      if (msg.type === "fireBullet") {
        const bullet = {
          x: clientData.circle.position.x,
          y: clientData.circle.position.y,
          directionX: clientData.direction.directionX,
          directionY: clientData.direction.directionY,
          distanceTravelled: 0,
        };
        bullets.push(bullet);
      }
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
      data: { allPositions, bullets },
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  setInterval(broadcastPositions, BROADCAST_RATE_INTERVAL); // Regular interval to broadcast positions

  // Function to update bullet positions
  function updateBullets() {
    bullets.forEach((bullet, index) => {
      const magnitude = Math.sqrt(
        bullet.directionX * bullet.directionX +
          bullet.directionY * bullet.directionY
      );

      bullet.x += (bullet.directionX / magnitude) * BULLET_SPEED;
      bullet.y += (bullet.directionY / magnitude) * BULLET_SPEED;
      bullet.distanceTravelled += BULLET_SPEED;

      // Remove bullets that are out of bounds or have travelled max distance
      if (
        bullet.distanceTravelled >= BULLET_MAX_DISTANCE ||
        bullet.x < 0 ||
        bullet.x > CANVAS_WIDTH ||
        bullet.y < 0 ||
        bullet.y > CANVAS_HEIGHT
      ) {
        bullets.splice(index, 1);
      }
    });
  }

  setInterval(() => {
    updateBullets();
  }, MOVEMENT_FREQUENCY_RATE);

  return wss;
}

module.exports = setupWebSocket;
