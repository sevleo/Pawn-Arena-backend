let nextClientId = 0;
let nextBulletId = 0;
let clients = new Map();
let entities = new Map();
let last_processed_input = {};
let bullets = new Map();
let removedBullets = new Map();
let bullet_sequence_number = null;

function getNewClientId() {
  return nextClientId++;
}

function getNewBulletId() {
  return nextBulletId++;
}

function setNewBulletSequenceNumber(val) {
  bullet_sequence_number = val;
  return bullet_sequence_number;
}

function updateGameState(message, engine, world) {
  setNewBulletSequenceNumber(message.bullet_sequence_number);
  const id = message.entity_id;
  const entity = entities.get(id);
  // const entity = entities.find((entity) => entity.clientId === id);
  if (entity) {
    entity.applyInput(message, world, bullet_sequence_number);
    last_processed_input[id] = message.input_sequence_number;
  }
}

module.exports = {
  nextClientId,
  nextBulletId,
  clients,
  entities,
  last_processed_input,
  bullets,
  updateGameState,
  getNewClientId,
  getNewBulletId,
  removedBullets,
  bullet_sequence_number,
  setNewBulletSequenceNumber,
};
