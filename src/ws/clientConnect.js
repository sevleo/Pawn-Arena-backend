const gameState = require("../services/gameState");
const Entity = require("../models/entity");
const Client = require("../models/client");

function createClientAndEntity(ws, world) {
  const client = new Client(ws);
  gameState.clients.push(client);

  const entity = new Entity(ws.clientId, world);
  gameState.entities.push(entity);
}

module.exports = { createClientAndEntity };
