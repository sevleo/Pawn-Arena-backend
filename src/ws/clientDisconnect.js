const gameState = require("../services/gameState");
const { Composite } = require("matter-js");

function handleClientDisconnection(ws, world) {
  if (gameState.clients.has(ws.clientId)) {
    gameState.clients.delete(ws.clientId);
  }

  if (gameState.entities.has(ws.clientId)) {
    try {
      Composite.remove(world, gameState.entities.get(ws.clientId).entityBody);
    } catch (err) {
      console.error(err);
    }
    gameState.entities.delete(ws.clientId);
  }

  console.log(`Client ${ws.clientId} disconnected`);
}

module.exports = { handleClientDisconnection };
