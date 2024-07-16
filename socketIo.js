const { Server } = require("socket.io");

function setupSocketIo(server, corsOptions) {
  const io = new Server(server, {
    cors: corsOptions,
  });

  let nextClientId = 0; // Initialize a counter for client IDs
  const clients = new Map();

  var position = {
    x: 200,
    y: 200,
  };

  io.on("connection", (socket) => {
    const clientId = nextClientId++;
    clients.set(clientId, socket); // Store the WebSocket connection with its ID
    console.log("a user connected");
    console.log(clients);

    // Send the current position to the newly connected client
    socket.emit("position", position);

    socket.on("move", (data) => {
      switch (data) {
        case "left":
          position.x -= 5;
          io.emit("position", position);
          break;
        case "right":
          position.x += 5;
          io.emit("position", position);
          break;
        case "up":
          position.y -= 5;
          io.emit("position", position);
          break;
        case "down":
          position.y += 5;
          io.emit("position", position);
          break;
      }
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
      clients.delete(clientId);
      console.log(clients);
    });
  });
}

module.exports = setupSocketIo;
