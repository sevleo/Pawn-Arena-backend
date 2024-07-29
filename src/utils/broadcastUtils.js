const WebSocket = require("ws"); // Add this line
const { BROADCAST_RATE_INTERVAL } = require("../config/gameConstants");

const { clients, bullets } = require("../services/gameStateService");

// Broadcast the updated position to all clients
function broadcastGameState(wss) {
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

function setBroadcastGameStateInterval(wss) {
  setInterval(() => broadcastGameState(wss), BROADCAST_RATE_INTERVAL);
}

module.exports = {
  setBroadcastGameStateInterval,
};
