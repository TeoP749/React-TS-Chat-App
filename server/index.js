import { Server } from 'socket.io';
import { createServer } from 'http';

const RED = "\u001b[31m";
const BLUE = "\u001b[34m";
const RESET = "\u001b[0m";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  }
});

const findSocket = (user_id) => {
  for (let [id, socket] of io.of("/").sockets) {
    if (socket.user_id === user_id) {
      return id;
    }
  }
}

io.use((socket, next) => {
  const id = socket.handshake.auth.id;
  const username = socket.handshake.auth.username;
  if (!id || !username) {
    return next(new Error("invalid username"));
  }

  socket.user_id = id;
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  console.log("user connected - ", socket.username);
  socket.onAny((event, ...args) => {
    console.log(`${BLUE}[INFO]: ${RESET} ${event} - `, args);
  });
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: socket.user_id,
      username: socket.username,
    });
  }

  socket.emit("users", users);
  socket.broadcast.emit("user connected", {
    userID: socket.user_id,
    username: socket.username,
  });

  socket.on("private message", ({ message, to }) => {
    socket.to(findSocket(to)).emit("private message", {
      message,
      from: socket.user_id,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.user_id);
  });
});

// io.of("/").adapter.on("create-room", (room) => {
//   console.log(`${BLUE}[INFO]: ${RESET} room ${room} was created`);
// });

// io.of("/").adapter.on("join-room", (room, id) => {
//   console.log(`${BLUE}[INFO]: ${RESET} socket ${id} has joined room ${room}`);
// });
io.of("/").adapter.on

setInterval(() => {
  console.log([...(io.of("/").sockets)].map((socket) => socket[1].username));
}, 1000)

httpServer.listen(3000, () => {
  console.log("server listening at http://localhost:3000");
});