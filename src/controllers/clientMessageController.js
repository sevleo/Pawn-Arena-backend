const {
  handleMove,
  handleBoost,
  handleFaceDirectionUpdate,
  handleBulletFire,
} = require("../services/clientActionHandler");

function handleMessage(message, clientData) {
  const msg = JSON.parse(message);

  switch (msg.type) {
    case "move":
      handleMove(msg, clientData);
      break;
    case "boost":
      handleBoost(msg, clientData);
      break;
    case "updateFaceDirection":
      handleFaceDirectionUpdate(msg, clientData);
      break;
    case "fireBullet":
      handleBulletFire(clientData);
      break;
  }
}

module.exports = {
  handleMessage,
};
