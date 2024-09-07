const clientMessages = require("../services/processClientMessages");
const { createEntity } = require("../models/entity");

function handleClientMessage(message, ws, world) {
  const msg = JSON.parse(message);
  msg.data.clientId = ws.clientId;
  switch (msg.type) {
    case "enter_game_request":
      console.log(msg);
      createEntity(ws, world);
      break;
    case "input":
      saveClientMessage(msg);
      break;
  }
}

module.exports = handleClientMessage;

function saveClientMessage(msg) {
  const message = {
    payload: msg.data,
  };
  clientMessages.messages.push(message);
}
