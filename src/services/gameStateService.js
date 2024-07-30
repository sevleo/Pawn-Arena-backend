const { GAME_SPEED_RATE } = require("../config/gameConstants");

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
function updateBullets() {
  bullets.forEach((bullet, index) => {
    bullet.move(bullets, index);
  });
}

function updateGameState() {
  updatePawns();
  updateBullets();
}

function setUpdateGameStateInterval() {
  setInterval(updateGameState, GAME_SPEED_RATE);
}

module.exports = {
  nextClientId,
  clients,
  bullets,
  setUpdateGameStateInterval,
};
