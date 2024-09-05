let nextClientId = 0;
let nextBulletId = 0;
let clients = [];
let entities = [];
let last_processed_input = {};
let bullets = [];
let removedBullets = [];
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
  // console.log(message);
  const id = message.entity_id;
  const entity = entities.find((entity) => entity.clientId === id);
  if (entity) {
    entity.applyInput(message, world, bullet_sequence_number);
    last_processed_input[id] = message.input_sequence_number;
  }

  // Collisions are handled by listening to Matter.Events
  // if (engine.detector.collisions.length > 0) {
  //   engine.detector.collisions.forEach((collision) => {
  //     // console.log(collision.bodyA);
  //     // console.log(collision.bodyB);
  //     // console.log(collision);
  //     if (
  //       collision.bodyA.label === "entity" &&
  //       collision.bodyB.label === "bullet"
  //     ) {
  //       // console.log(collision);
  //       // console.log(collision.bodyA);
  //       // console.log(collision.bodyB);
  //       // console.log(
  //       //   `Bullet of entity ${collision.bodyA.clientId} has hit entity ${collision.bodyB.clientId}`
  //       // );
  //     }
  //     if (
  //       collision.bodyA.label === "bullet" &&
  //       collision.bodyB.label === "entity"
  //     ) {
  //       // console.log(collision);
  //       // console.log(collision.bodyA);
  //       // console.log(
  //       //   `Bullet of entity ${collision.bodyA.clientId} has hit entity ${collision.bodyB.clientId}`
  //       // );
  //     }
  //   });
  // }
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
