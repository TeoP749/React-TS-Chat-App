import { Server } from 'socket.io';

const RED = "\u001b[31m";
const BLUE = "\u001b[34m";
const RESET = "\u001b[0m";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  }
});

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

  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg);
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

io.listen(3000);