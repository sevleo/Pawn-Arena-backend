const {
  MOVEMENT_SPEED,
  MOVEMENT_SPEED_BOOST,
  THROTTLING_INTERVAL,
  MOVEMENT_FREQUENCY_RATE,
} = require("./gameConstants");

function handleGameMessage(msg, clientData) {
  const now = Date.now();

  if (msg.type === "move") {
    console.log(now - clientData.lastUpdate);
    // Throttling
    if (now - clientData.lastUpdate >= THROTTLING_INTERVAL) {
      // Update movement state based on message
      clientData.moving.movingRight = msg.data.includes("ArrowRight");
      clientData.moving.movingLeft = msg.data.includes("ArrowLeft");
      clientData.moving.movingUp = msg.data.includes("ArrowUp");
      clientData.moving.movingDown = msg.data.includes("ArrowDown");

      clientData.lastUpdate = now;
      updateMovementIntervals(clientData);
    }
  }

  if (msg.type === "boost") {
    console.log("boost");
    if (msg.data === true) {
      clientData.speed = MOVEMENT_SPEED_BOOST;
    } else {
      clientData.speed = MOVEMENT_SPEED;
    }
  }
}

function updateMovementIntervals(clientData) {
  // Define movement functions
  function move() {
    if (clientData.moving.movingRight) {
      clientData.position.x += clientData.speed;
    }
    if (clientData.moving.movingLeft) {
      clientData.position.x -= clientData.speed;
    }
    if (clientData.moving.movingUp) {
      clientData.position.y -= clientData.speed;
    }
    if (clientData.moving.movingDown) {
      clientData.position.y += clientData.speed;
    }
  }

  // Clear existing intervals if they exist
  if (clientData.movementIntervalId)
    clearInterval(clientData.movementIntervalId);

  // Start a single interval for movement updates
  clientData.movementIntervalId = setInterval(move, MOVEMENT_FREQUENCY_RATE);
}

module.exports = handleGameMessage;
