const clientMessages = require("../services/processClientMessages");

function handleClientMessage(message, ws) {
  const msg = JSON.parse(message);
  msg.data.entity_id = ws.clientId;
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
  console.log(message);
  clientMessages.messages.push(message);
  // console.log(message);
}
