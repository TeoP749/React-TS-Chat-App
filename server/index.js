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
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

io.on('connection', (socket) => {
  console.log('a user connected');

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }

  socket.emit("users", users);
  console.log("before emit " + socket.username);
  socket.broadcast.emit("user connected", {
    userID: socket.id,
    username: socket.username,
  });

  socket.on('message', (msg) => {
    socket.broadcast.emit('message', msg);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user disconnected", socket.id);
  });
});

io.of("/").adapter.on("create-room", (room) => {
  console.log(`${BLUE}[INFO]: ${RESET} room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
  console.log(`${BLUE}[INFO]: ${RESET} socket ${id} has joined room ${room}`);
});

setInterval(() => {
  console.log([...(io.of("/").sockets)].map((socket) => socket[1].username));
}, 1000)

io.listen(3000);