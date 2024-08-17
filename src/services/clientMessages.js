const { updateGameState } = require("./gameState");
const { GAME_SPEED_RATE } = require("../config/gameConstants");

let messages = [];

// Loop to update the game state
function setProcessClientMessagesInterval() {
  return setInterval(() => {
    processClientMessages();
  }, GAME_SPEED_RATE);
}

module.exports = {
  messages,
  setProcessClientMessagesInterval,
};

function processClientMessages() {
  while (messages.length > 0) {
    let message = getMessage();
    if (message && validateInput(message)) {
      updateGameState(message);
    }
  }
}

function getMessage() {
  const now = Date.now();
  for (let i = 0; i < messages.length; i++) {
    // Access each message in the queue.
    const message = messages[i];
    // // Check if the message's designated reception time has passed or is equal to the current time.
    if (message.recv_ts <= now) {
      messages.splice(i, 1);
      return message.payload;
    }
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
