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

app.get("/", (req, res) => {
  res.send("The server is running");
});

io.on("connection", (socket) => {
  console.log("a user conencted");
  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening in http://localhost:${PORT}`);
});
