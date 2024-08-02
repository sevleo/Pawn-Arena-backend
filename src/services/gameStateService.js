const { GAME_SPEED_RATE } = require("../config/gameConstants");
const { redisClient } = require("../utils/redisClient");
const { Engine, Composite, Detector } = require("matter-js");

const clients = new Map();
const bullets = [];
let nextClientId = 0;
let lastTime;

function setUpdateGameStateInterval(engine, world) {
  lastTime = Date.now();
  setInterval(() => updateGameState(engine, world), GAME_SPEED_RATE);
}

function updateGameState(engine, world) {
  const now = Date.now();
  const delta = now - lastTime;
  lastTime = now;

  updatePawns();
  updateBullets(world);
  handleCollisions(world);
  Engine.update(engine, delta);
  saveGameStateToRedis();
}

module.exports = {
  nextClientId,
  clients,
  bullets,
  setUpdateGameStateInterval,
  // loadGameStateFromRedis,
};

function saveGameStateToRedis() {
  const state = {
    allPawns: Array.from(clients.entries()).map(([id, client]) => ({
      clientId: id,
      radius: client.pawn.radius,
      position: {
        x: client.pawn.body.position.x,
        y: client.pawn.body.position.y,
      },
      direction: client.pawn.direction,
    })),

    bullets: bullets.map((bullet) => ({
      clientId: bullet.clientId,
      angle: bullet.body.angle,
      radius: bullet.bulletRadius,
      width: bullet.bulletWidth,
      height: bullet.bulletHeight,
      position: {
        x: bullet.body.position.x,
        y: bullet.body.position.y,
      },
    })),
  };

  redisClient.set("gameState", JSON.stringify(state), (err) => {
    if (err) {
      console.error("Failed to save game state to Redis: ", err);
    }
  });
}

// For game saving
// function loadGameStateFromRedis() {
//   redisClient.get("gameState", (err, reply) => {
//     if (err) {
//       console.error("Failed to load game state from Redis: ", err);
//     } else if (reply) {
//       const state = JSON.parse(reply);
//     }
//   });
// }

// Updates position of pawns
function updatePawns() {
  clients.forEach((clientData) => {
    clientData.pawn.move(clientData);
  });
}

// Updates position of bullets and checks for collisions with pawns
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.update(bullets, index);
  });
}

// Handles collisions using Matter.Detector
function handleCollisions(world) {
  // Create a detector with the current bodies in the world
  const detector = Detector.create({ bodies: Composite.allBodies(world) });

  // Find all collision pairs using the detector
  const collisions = Detector.collisions(detector);

  collisions.forEach(({ bodyA, bodyB }) => {
    if (bodyA.clientId === bodyB.clientId) {
      return;
    }
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

            // console.log(
            //   `Bullet of player ${bullet.clientId} collided with pawn of player ${clientData.clientId}`
            // );

            // Exit the loop early since the bullet has been removed
            return;
          }
        });
      }
    });
  });
}
