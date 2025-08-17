// server.js
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// In-memory user list
const users = {}; // socketId -> { username, color }

// deterministic color generator
function makeColorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join", (username) => {
    const color = makeColorFromName(username + socket.id);
    users[socket.id] = { username, color };
    io.emit("users", users);
    // let the new user know their id
    socket.emit("joined", { id: socket.id });
  });

  socket.on("codeChange", (code) => {
    socket.broadcast.emit("codeUpdate", { code });
  });

  socket.on("typing", (isTyping) => {
    const u = users[socket.id];
    if (u) socket.broadcast.emit("typing", { id: socket.id, username: u.username, typing: isTyping });
  });

  socket.on("cursorUpdate", (payload) => {
    const u = users[socket.id];
    if (u) socket.broadcast.emit("cursorUpdate", { id: socket.id, username: u.username, color: u.color, payload });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", users);
    io.emit("userDisconnected", { id: socket.id });
    console.log("user disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
