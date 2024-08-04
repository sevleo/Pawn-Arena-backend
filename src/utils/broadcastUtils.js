const WebSocket = require("ws"); // Add this line
const { BROADCAST_RATE_INTERVAL } = require("../config/gameConstants");
const { redisClient } = require("./redisClient");

const { clients, bullets } = require("../services/gameStateService");

function setBroadcastGameStateInterval(wss) {
  setInterval(() => broadcastGameState(wss), BROADCAST_RATE_INTERVAL);
}

module.exports = {
  setBroadcastGameStateInterval,
};

// Broadcast the updated position to all clients
function broadcastGameState(wss) {
  const allPawns = Array.from(clients.entries()).map(([id, client]) => ({
    clientId: id,
    radius: client.pawn.radius,
    position: {
      x: client.pawn.body.position.x,
      y: client.pawn.body.position.y,
    },
    direction: client.pawn.direction,
    health: client.pawn.health,
  }));

  const simplifiedBullets = bullets.map((bullet) => ({
    clientId: bullet.clientId,
    angle: bullet.body.angle,
    radius: bullet.bulletRadius,
    width: bullet.bulletWidth,
    height: bullet.bulletHeight,
    position: {
      x: bullet.body.position.x,
      y: bullet.body.position.y,
    },
  }));

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const data = {
        allPawns,
        bullets: simplifiedBullets,
        clientPawn: {
          health: client.clientData.pawn.health,
        },
      };
      const message = JSON.stringify({ type: "gameState", data });
      client.send(message);
    }
  });
}

// async function broadcastGameState(wss) {
//   const gameState = await redisClient.get("gameState");
//   const parsedGameState = JSON.parse(gameState);
//   const message = JSON.stringify({ type: "gameState", data: parsedGameState });
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(message);
//     }
//   });
// }
