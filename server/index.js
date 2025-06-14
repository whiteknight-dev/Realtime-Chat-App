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

function getConnectedNicknames() {
  return Array.from(users.values());
}

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join", (nickName) => {
    nickName = nickName.trim();
    users.set(socket.id, nickName);
    console.log(`the user ${nickName} has joined`);

    io.emit("receiveMessage", {
      sender: "System",
      message: `${nickName} has joined the chat`,
    });

    io.emit("updateUsersList", getConnectedNicknames());
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    const disconnectedUser = users.get(socket.id);

    if (disconnectedUser) {
      users.delete(socket.id);
      console.log(`User ${disconnectedUser} (${socket.id}) has left the chat.`);

      io.emit("receiveMessage", {
        sender: "System",
        message: `${disconnectedUser} has left the chat`,
      });

      io.emit("updateUsersList", getConnectedNicknames());
    } else {
      console.log(`Unknown user ${socket.id} has left the chat`);
    }
  });

  socket.on("sendMessage", (messageContent) => {
    const senderNickname = users.get(socket.id);

    if (senderNickname) {
      console.log(`Mensaje de ${senderNickname}: ${messageContent}`);

      io.emit("receiveMessage", {
        sender: senderNickname,
        message: messageContent,
        // TODO: it's possible to add a timestamp
      });
    } else {
      console.log(
        `Mensaje de usuario no registrado (${socket.id}): ${messageContent}`
      );
    }
  });
});

// TODO: test the 6th fase

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening in http://localhost:${PORT}`);
});
