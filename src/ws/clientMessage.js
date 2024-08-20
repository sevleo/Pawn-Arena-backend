const clientMessages = require("../services/clientMessages");

function handleClientMessage(message, ws) {
  const data = JSON.parse(message);
  data.data.entity_id = ws.clientId;
  switch (data.type) {
    case "input":
      const message = {
        payload: data.data,
      };
      clientMessages.messages.push(message);
      break;
  }
}

module.exports = handleClientMessage;
