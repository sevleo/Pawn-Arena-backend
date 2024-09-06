const gameState = require("../services/gameState");

function handleClientDisconnection(ws) {
  if (gameState.clients.has(ws.clientId)) {
    gameState.clients.delete(ws.clientId);
  }

  if (gameState.entities.has(ws.clientId)) {
    gameState.entities.delete(ws.clientId);
  }

  console.log(`Client ${ws.clientId} disconnected`);
}

module.exports = { handleClientDisconnection };
