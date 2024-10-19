const express = require("express");
const app = express();
require("dotenv").config();
const port = 8000;
const { Server } = require("socket.io");
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("id", socket.id);
  socket.on("hello", (data) => {
    console.log("Data ", `${data} ${socket.id}`);
  });
  socket.broadcast.emit("hello", `connected ${socket.id}`);
  socket.on("message", (data) => {
    console.log("Message", data);
    socket.broadcast.emit("message", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
    socket.broadcast.emit("hello", `disconnected ${socket.id}`);
  });
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
