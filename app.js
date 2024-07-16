const cors = require("cors");
const express = require("express");
const http = require("http");
const setupWebSocket = require("./webSocket");
// const setupSocketIo = require("./socketIo");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

setupWebSocket(server);
// setupSocketIo(server, corsOptions);

server.listen(3000, () => {
  console.log("Listening at :3000...");
});
