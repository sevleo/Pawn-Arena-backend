const { GAME_SPEED_RATE } = require("../config/gameConstants");
const { Engine } = require("matter-js");

const clients = new Map();
const bullets = [];
let nextClientId = 0;

// Updates position of pawns
function updatePawns() {
  clients.forEach((clientData) => {
    clientData.pawn.move(clientData);
  });
}

// Updates position of bullets
function updateBullets(engine) {
  bullets.forEach((bullet, index) => {
    bullet.move(bullets, index);
  });
}

function updateGameState(engine) {
  updatePawns();
  updateBullets();
  detectCollisions();
  Engine.update(engine, 1000 / 60);
}

function detectCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    clients.forEach((clientData, clientId) => {
      if (bullet.clientId !== clientId) {
        const pawn = clientData.pawn;
        const distance = Math.sqrt(
          (bullet.position.x - pawn.position.x) ** 2 +
            (bullet.position.y - pawn.position.y) ** 2
        );

        if (distance < bullet.bulletRadius + pawn.radius) {
          // Collision detected
          // Handle the collision (e.g., remove bullet, reduce pawn health, etc.)
          bullets.splice(bulletIndex, 1); // Remove the bullet
          console.log(
            `Collision detected! Bullet of pawn ${bullet.clientId} hit pawn ${clientId}.`
          );
          // Additional logic for handling the pawn can be added here
        }
      }
    });
  });
}

function setUpdateGameStateInterval(engine) {
  setInterval(() => updateGameState(engine), GAME_SPEED_RATE);
}

module.exports = {
  nextClientId,
  clients,
  bullets,
  setUpdateGameStateInterval,
};
