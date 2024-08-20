const { updateGameState } = require("./gameState");
const { GAME_SPEED_RATE } = require("../config/gameConstants");
const { broadcastWorldState } = require("../ws/broadcastData");

let messages = [];

// Loop to update the game state
function setProcessClientMessagesInterval(wss) {
  return setInterval(() => {
    processClientMessages();
    broadcastWorldState(wss);
  }, GAME_SPEED_RATE);
}

module.exports = {
  messages,
  setProcessClientMessagesInterval,
};

function processClientMessages() {
  while (messages.length > 0) {
    const message = getMessage();
    if (message && validateInput(message)) {
      updateGameState(message);
    }
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
