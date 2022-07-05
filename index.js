const { Server } = require("socket.io");

const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  if (!onlineUsers.some((item) => item.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((item) => item.socketId === socketId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", onlineUsers);
  });

  socket.on("sendMessage", (data) => {
    io.emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
  });
});
