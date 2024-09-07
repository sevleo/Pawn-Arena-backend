const gameState = require("../services/gameState");
const Client = require("../models/client");

function createClient(ws, world) {
  const client = new Client(ws);
  gameState.clients.set(client.clientId, client);
}

module.exports = { createClient };
