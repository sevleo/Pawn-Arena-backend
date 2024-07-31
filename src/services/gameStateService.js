const { GAME_SPEED_RATE } = require("../config/gameConstants");
const { Engine } = require("matter-js");

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

// Updates position of bullets
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.update(bullets, index);
  });
}

function updateGameState(engine) {
  const now = Date.now();
  const delta = now - lastTime;
  lastTime = now;

  updatePawns();
  updateBullets();
  Engine.update(engine, delta);
}

function setUpdateGameStateInterval(engine) {
  lastTime = Date.now();
  setInterval(() => updateGameState(engine), GAME_SPEED_RATE);
}

module.exports = {
  nextClientId,
  clients,
  bullets,
  setUpdateGameStateInterval,
};
