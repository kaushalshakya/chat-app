const socketIO = require("socket.io");
require("dotenv").config();
const Messages = require("../models/message.model");
const { invaildateMessages } = require("./cache.helper");

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("send", async (message) => {
      const { query } = socket.handshake;
      const { sender, receiver } = query;
      invaildateMessages(`messages:${sender}-${receiver}`);
      invaildateMessages(`messages:${receiver}-${sender}`);
      socket.broadcast.emit("send", message);
      await Messages.create({ sender, receiver, message });
    });
  });

  return io;
};
