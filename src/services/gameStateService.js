const { GAME_SPEED_RATE } = require("../config/gameConstants");
const { Engine, Collision, Composite, Detector } = require("matter-js");

const clients = new Map();
const bullets = [];
let nextClientId = 0;

let lastTime;

// Updates position of pawns
function updatePawns() {
  clients.forEach((clientData) => {
    clientData.pawn.move(clientData);
  });
}

// Updates position of bullets and checks for collisions with pawns
function updateBullets(world) {
  bullets.forEach((bullet, index) => {
    bullet.update(bullets, index);

    // Check collision with all pawns
    // clients.forEach((clientData) => {
    //   const pawnBody = clientData.pawn.body;
    //   const bulletBody = bullet.body;

    //   // Check for collision using Matter.Collision
    //   const collision = Collision.collides(bulletBody, pawnBody);

    //   if (collision) {
    //     Composite.remove(world, bulletBody);
    //     bullets.splice(index, 1);

    //     console.log(
    //       `Bullet of player ${bullet.clientId} collided with pawn of player ${clientData.clientId}`
    //     );

    //     // Exit the loop early since the bullet has been removed
    //     return;
    //   }
    // });
  });
}

// Handles collisions using Matter.Detector
function handleCollisions(world) {
  // Create a detector with the current bodies in the world
  const detector = Detector.create({ bodies: Composite.allBodies(world) });

  // Find all collision pairs using the detector
  const collisions = Detector.collisions(detector);

  collisions.forEach(({ bodyA, bodyB }) => {
    // Find the bullet in the collision pair
    bullets.forEach((bullet, index) => {
      if (bullet.body === bodyA || bullet.body === bodyB) {
        const otherBody = bodyA === bullet.body ? bodyB : bodyA;

        // Check if the other body is a pawn
        clients.forEach((clientData) => {
          if (clientData.pawn.body === otherBody) {
            // Remove the bullet from the world and the bullets array
            Composite.remove(world, bullet.body);
            bullets.splice(index, 1);

            console.log(
              `Bullet of player ${bullet.clientId} collided with pawn of player ${clientData.clientId}`
            );

            // Exit the loop early since the bullet has been removed
            return;
          }
        });
      }
    });
  });
}

function updateGameState(engine, world) {
  const now = Date.now();
  const delta = now - lastTime;
  lastTime = now;

  updatePawns();
  updateBullets(world);
  Engine.update(engine, delta);

  handleCollisions(world);
}

function setUpdateGameStateInterval(engine, world) {
  lastTime = Date.now();
  setInterval(() => updateGameState(engine, world), GAME_SPEED_RATE);
}

module.exports = {
  nextClientId,
  clients,
  bullets,
  setUpdateGameStateInterval,
};
