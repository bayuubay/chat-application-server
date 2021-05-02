const http = require("http");
const express = require("express");
const database = require("./config/db");
database();
// const socketio = require("socket.io");
const cors = require("cors");
const router = require("./router");
const { addUser, getUser, removeUser } = require("./src/controllers/users");
const { newMessage } = require("./src/controllers/chat");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
const server = http.createServer(app);

// const io = socketio(server);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chat-apps-client.herokuapp.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("new Connection");

  socket.on("join", async ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) {
      socket.emit("error", error);
      return error
    }
    socket.join(user.room);
    //check data message di database based on roomID
    // show old message

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined to ${user.room}`,
    });
    callback();
  });

  socket.on("sendMessage", async (message) => {
    const user = getUser(socket.id);

    //send data to database

    newMessage(user, message);
    io.to(user.room).emit("message", { user: user.name, text: message });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
    }
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
