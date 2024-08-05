const WebSocket = require("ws"); // Add this line
const { BROADCAST_RATE_INTERVAL } = require("../config/gameConstants");
const { publisher } = require("./redisClient");

function setBroadcastGameStateInterval(wss) {
  setInterval(() => broadcastGameState(wss), BROADCAST_RATE_INTERVAL);
}

module.exports = {
  setBroadcastGameStateInterval,
};

async function broadcastGameState(wss) {
  const gameState = await publisher.get("gameState");
  const parsedGameState = JSON.parse(gameState);
  // console.log(parsedGameState);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const data = {
        allPawns: parsedGameState.allPawns,
        bullets: parsedGameState.bullets,
        clientPawn: {
          health: client.clientData.pawn.health,
          position: client.clientData.pawn.body.position,
        },
      };
      const message = JSON.stringify({ type: "gameState", data });
      client.send(message);
    }
  });
}
