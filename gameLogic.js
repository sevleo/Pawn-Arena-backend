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
      movingRight: msg.data.includes("arrowright") || msg.data.includes("d"),
      movingLeft: msg.data.includes("arrowleft") || msg.data.includes("a"),
      movingUp: msg.data.includes("arrowup") || msg.data.includes("w"),
      movingDown: msg.data.includes("arrowdown") || msg.data.includes("s"),
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

    // Handle moving right
    if (clientData.moving.movingRight) {
      xChange = clientData.speed;
    }

    // Handle moving left
    if (clientData.moving.movingLeft) {
      xChange = -clientData.speed;
    }

    // Handle moving up
    if (clientData.moving.movingUp) {
      yChange = -clientData.speed;
    }

    // Handle moving down
    if (clientData.moving.movingDown) {
      yChange = clientData.speed;
    }

    // Normalize the speed for diagonal movement
    if (xChange !== 0 && yChange !== 0) {
      const diagonalFactor = 0.7071; // or Math.sqrt(2) / 2
      xChange *= diagonalFactor;
      yChange *= diagonalFactor;
    }

    // Update circle position
    clientData.circle.move(xChange, yChange, CANVAS_WIDTH, CANVAS_HEIGHT);

    // console.log(
    //   `${clientData.circle.position.x}, ${clientData.circle.position.y}`
    // );
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
