require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const users = new Map();

app.get("/", (req, res) => {
  res.send("The server is running");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", (nickName) => {
    users.set(socket.id, nickName);
    console.log(`the user ${nickName} has joined`);

    io.emit("receiveMessage", {
      sender: "System",
      message: `${nickName} has joind the chat`,
    });
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    disconnectedUser = users.get(socket.id);

    if (disconnectedUser) {
      users.delete(socket.id);
      console.log(`User ${disconnectedUser} (${socket.id}) has left the chat.`);

      socket.broadcast.emit("receiveMessage", {
        sender: "System",
        content: `${disconnectedUser} has left the chat`,
        type: "system",
      });
    } else {
      console.log(`Unknown user ${socket.id} has left the chat`);
    }
  });

  //TODO: Implementar la lógica de recibir y mostrar el mensaje
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening in http://localhost:${PORT}`);
});
