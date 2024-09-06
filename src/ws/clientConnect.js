const gameState = require("../services/gameState");
const Entity = require("../models/entity");
const Client = require("../models/client");

function createClientAndEntity(ws, world) {
  const client = new Client(ws);
  gameState.clients.set(client.clientId, client);

  const entity = new Entity(ws.clientId, world);
  gameState.entities.set(entity.clientId, entity);
}

module.exports = { createClientAndEntity };
