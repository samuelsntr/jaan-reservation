// socket.js
const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // In production, restrict to your frontend domain
    },
  });

  io.on("connection", (socket) => {
    console.log("Admin connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Admin disconnected:", socket.id);
    });
  });
}

function emitNewReservation(reservation) {
  if (io) {
    const data = reservation.dataValues ? reservation.dataValues : reservation;
    console.log("Emitting new-reservation event");
    io.emit("new-reservation", data);
  } else {
    console.log("Socket.io instance not initialized");
  }
}

module.exports = { initSocket, emitNewReservation };
