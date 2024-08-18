const gameState = require("../services/gameState");

function handleClientDisconnection(ws) {
  const clientIndex = gameState.clients.findIndex(
    (client) => client.clientId === ws.clientId
  );
  if (clientIndex !== -1) {
    gameState.clients.splice(clientIndex, 1);
  }

  const entityIndex = gameState.entities.findIndex(
    (entity) => entity.clientId === ws.clientId
  );
  if (entityIndex !== -1) {
    gameState.entities.splice(entityIndex, 1);
  }

  console.log(`Client ${ws.clientId} disconnected`);
}

module.exports = { handleClientDisconnection };
