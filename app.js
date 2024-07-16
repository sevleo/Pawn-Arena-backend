const cors = require("cors");
const express = require("express");
const http = require("http");
// const { Server } = require("socket.io");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

var position = {
  x: 200,
  y: 200,
};

// Websockets implementation
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("a user connected");

  // Send the current position to the newly connected client
  ws.send(JSON.stringify({ type: "position", data: position }));

  ws.on("message", (message) => {
    const msg = JSON.parse(message);

    if (msg.type === "move") {
      switch (msg.data) {
        case "left":
          position.x -= 5;
          break;
        case "right":
          position.x += 5;
          break;
        case "up":
          position.y -= 5;
          break;
        case "down":
          position.y += 5;
          break;
      }
    }

    // Broadcast the updated position to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "position", data: position }));
      }
    });
  });
  ws.on("close", () => {
    console.log("user disconnected");
  });
});

// Socket.io implementation
// const io = new Server(server, {
//   cors: corsOptions,
// });

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   // Send the current position to the newly connected client
//   socket.emit("position", position);

//   socket.on("move", (data) => {
//     switch (data) {
//       case "left":
//         position.x -= 5;
//         io.emit("position", position);
//         break;
//       case "right":
//         position.x += 5;
//         io.emit("position", position);
//         break;
//       case "up":
//         position.y -= 5;
//         io.emit("position", position);
//         break;
//       case "down":
//         position.y += 5;
//         io.emit("position", position);
//         break;
//     }
//   });
// });

server.listen(3000, () => {
  console.log("Listening at :3000...");
});
