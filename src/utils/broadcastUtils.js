const WebSocket = require("ws"); // Add this line
const { BROADCAST_RATE_INTERVAL } = require("../config/gameConstants");

const { clients, bullets } = require("../services/gameStateService");

// Broadcast the updated position to all clients
function broadcastGameState(wss) {
  const allPawns = Array.from(clients.entries()).map(([id, client]) => ({
    clientId: id,
    radius: client.pawn.radius,
    position: {
      x: client.pawn.body.position.x,
      y: client.pawn.body.position.y,
    },
    direction: client.direction,
  }));

  const simplifiedBullets = bullets.map((bullet) => ({
    clientId: bullet.clientId,
    radius: bullet.bulletRadius,
    position: {
      x: bullet.body.position.x,
      y: bullet.body.position.y,
    },
  }));

  const message = JSON.stringify({
    type: "gameState",
    data: { allPawns, bullets: simplifiedBullets },
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
