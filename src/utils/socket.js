const { getRoomUsers } = require("../routes/rooms");

module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("room.join", (roomName) => {
      socket.join(`room/${roomName}`);
      const users = getRoomUsers(roomName);
      socket.nsp.to(`room/${roomName}`).emit("room.listUsers", users);
    });
    socket.on("room.list", (roomName) => {
      const users = getRoomUsers(roomName);
      socket.to(`room/${roomName}`).emit("room.listUsers", users);
    });
    socket.on("message.send", (data) => {
      console.log(data);
      socket.to(`room/${data.roomName}`).emit("message.recive", data.msg);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
