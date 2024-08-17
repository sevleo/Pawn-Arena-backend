const clientMessages = require("../services/clientMessages");

function handleClientMessage(message, ws) {
  const data = JSON.parse(message);
  switch (data.type) {
    case "input":
      data.data.entity_id = ws.clientId;
      clientMessages.messages.push({
        recv_ts: Date.now(),
        payload: data.data,
      });
      break;
  }
}

module.exports = handleClientMessage;
