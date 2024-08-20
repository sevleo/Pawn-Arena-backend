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

module.exports = {
  nextClientId,
  clients,
  entities,
  last_processed_input,
  updateGameState,
  getNewClientId,
};
