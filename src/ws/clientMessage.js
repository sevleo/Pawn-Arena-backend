const clientMessages = require("../services/processClientMessages");

function handleClientMessage(message, ws) {
  const msg = JSON.parse(message);
  msg.data.clientId = ws.clientId;
  switch (msg.type) {
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
