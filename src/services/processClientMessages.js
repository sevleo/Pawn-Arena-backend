const { Engine, Composite, Detector } = require("matter-js");
const { updateGameState, bullets } = require("./gameState");
const { GAME_SPEED_RATE } = require("../config/gameConstants");

let messages = [];
let lastTime;

// Loop to update the game state
function setProcessClientMessagesInterval(engine, world) {
  return setInterval(() => {
    processClientMessages(engine, world);

    updateBullets(world);

    const now = Date.now();
    const delta = now - lastTime;
    lastTime = now;

    Engine.update(engine, delta);
  }, GAME_SPEED_RATE);
}

function updateBullets(world) {
  bullets.forEach((bullet) => {
    bullet.updatePosition(world);
  });
}

module.exports = {
  messages,
  setProcessClientMessagesInterval,
};

function processClientMessages(engine, world) {
  try {
    while (messages.length > 0) {
      const message = getMessage();
      if (message && validateInput(message)) {
        updateGameState(message, engine, world);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function getMessage() {
  for (let i = 0; i < messages.length; i++) {
    // Access each message in the queue.
    const message = messages[i];
    messages.splice(i, 1);
    return message.payload;
  }
}

// Check whether this input seems to be valid (e.g. "make sense" according
// to the physical rules of the World)
function validateInput(input) {
  if (Math.abs(input.press_time) > 1 / 40) {
    return false;
  }
  return true;
}
