const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

// CORS Configuration from environment
const allowedOrigins = process.env.SOCKET_CORS_ORIGINS
  ? process.env.SOCKET_CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'https://celadon-mooncake-e0352e.netlify.app'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// User socket mapping: {userId: socketId}
const userSocketMap = {};

/**
 * Get socket ID for a specific user
 * @param {string} receiverId - User ID
 * @returns {string|undefined} Socket ID
 */
const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

/**
 * Socket.IO connection handler
 */
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("User connected:", {
    socketId: socket.id,
    userId: userId !== "undefined" ? userId : "guest",
  });

  // Map user ID to socket ID
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;

    // Broadcast updated online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", {
      socketId: socket.id,
      userId: userId !== "undefined" ? userId : "guest",
    });

    // Remove user from mapping
    if (userId && userId !== "undefined") {
      delete userSocketMap[userId];

      // Broadcast updated online users list
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // Handle socket errors
  socket.on("error", (error) => {
    console.error("Socket error:", {
      socketId: socket.id,
      userId,
      error: error.message,
    });
  });
});

module.exports = { app, io, server, getReceiverSocketId };
