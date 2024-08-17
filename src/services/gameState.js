const { BROADCAST_RATE_INTERVAL } = require("../config/gameConstants");

let nextClientId = 0;
let clients = [];
let entities = [];
let last_processed_input = {};

function getNewClientId() {
  return nextClientId++;
}

function updateGameState(message) {
  const id = message.entity_id;
  const entity = entities.find((entity) => entity.clientId === id);
  if (entity) {
    entity.applyInput(message);
    last_processed_input[id] = message.input_sequence_number;
  }
}

// Loop to broadcast the game state
function setBroadcastWorldStateInterval(wss) {
  return setInterval(() => {
    broadcastWorldState(wss);
  }, BROADCAST_RATE_INTERVAL);
}
function broadcastWorldState(wss) {
  // Send the world state to all the connected clients.
  let world_state = entities.map((entity) => {
    return {
      entity_id: entity.clientId,
      position: entity.x,
      last_processed_input: last_processed_input[entity.clientId] || null,
    };
  });

  const worldStateMessage = JSON.stringify({
    type: "world_state",
    data: world_state,
  });

  wss.clients.forEach((client) => {
    client.send(worldStateMessage);
  });
}

module.exports = {
  nextClientId,
  clients,
  entities,
  last_processed_input,
  updateGameState,
  setBroadcastWorldStateInterval,
  getNewClientId,
};
