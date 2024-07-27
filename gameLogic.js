const {
  MOVEMENT_SPEED,
  MOVEMENT_SPEED_BOOST,
  THROTTLING_INTERVAL,
  MOVEMENT_FREQUENCY_RATE,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} = require("./gameConstants");

function handleGameMessage(msg, clientData) {
  const now = Date.now();

  if (
    msg.type === "move" &&
    now - clientData.lastUpdate >= THROTTLING_INTERVAL
  ) {
    // Throttling
    // Update movement state based on message
    clientData.moving = {
      movingRight: msg.data.includes("ArrowRight"),
      movingLeft: msg.data.includes("ArrowLeft"),
      movingUp: msg.data.includes("ArrowUp"),
      movingDown: msg.data.includes("ArrowDown"),
    };

    clientData.lastUpdate = now;
    updateMovementIntervals(clientData);
  }

  if (msg.type === "boost") {
    clientData.speed = msg.data ? MOVEMENT_SPEED_BOOST : MOVEMENT_SPEED;
  }
}

function updateMovementIntervals(clientData) {
  // Define movement functions
  function move() {
    let xChange = 0;
    let yChange = 0;

    // Handle horizontal movement
    if (clientData.moving.movingRight) {
      xChange = Math.min(
        clientData.speed,
        CANVAS_WIDTH - clientData.circle.position.x
      );
    }
    if (clientData.moving.movingLeft) {
      xChange = -Math.min(clientData.speed, clientData.circle.position.x);
    }

    // Handle vertical movement
    if (clientData.moving.movingUp) {
      yChange = -Math.min(clientData.speed, clientData.circle.position.y);
    }

    if (clientData.moving.movingDown) {
      yChange = Math.min(
        clientData.speed,
        CANVAS_HEIGHT - clientData.circle.position.y
      );
    }

    // Normalize the speed for diagonal movement
    if (xChange !== 0 && yChange !== 0) {
      const diagonalFactor = 0.7071; // or Math.sqrt(2) / 2
      xChange *= diagonalFactor;
      yChange *= diagonalFactor;
    }

    // Update position
    clientData.circle.position.x = Math.round(
      clientData.circle.position.x + xChange
    );
    clientData.circle.position.y = Math.round(
      clientData.circle.position.y + yChange
    );

    console.log(
      `${clientData.circle.position.x}, ${clientData.circle.position.y}`
    );
  }

  // Clear existing intervals if they exist
  if (clientData.movementIntervalId)
    clearInterval(clientData.movementIntervalId);

  // Check if there are active directions and set interval
  if (Object.values(clientData.moving).some(Boolean)) {
    clientData.movementIntervalId = setInterval(move, MOVEMENT_FREQUENCY_RATE);
  }
}

module.exports = handleGameMessage;
