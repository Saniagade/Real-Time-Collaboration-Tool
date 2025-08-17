// client.js
const socket = io();

// username prompt & storage
let username = localStorage.getItem("cc_username") || "";
if (!username) username = prompt("Enter your name (for others to see):") || "User" + Math.floor(Math.random()*1000);
localStorage.setItem("cc_username", username);
document.getElementById("myName").textContent = "You: " + username;

document.getElementById("changeName").addEventListener("click", () => {
  const n = prompt("Change name:", username);
  if (n) {
    username = n;
    localStorage.setItem("cc_username", n);
    document.getElementById("myName").textContent = "You: " + n;
    socket.emit("join", n);
  }
});

socket.emit("join", username);

const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  lineNumbers: true,
  mode: "javascript",
  theme: "dracula",
  tabSize: 2
});

let isApplyingRemote = false;

// broadcast local changes (debounced)
let changeTimer = null;
editor.on("change", (cm, change) => {
  if (isApplyingRemote) return;
  clearTimeout(changeTimer);
  changeTimer = setTimeout(() => {
    const code = cm.getValue();
    socket.emit("codeChange", code);
  }, 120);
});

// apply incoming code updates
socket.on("codeUpdate", ({ code }) => {
  const local = editor.getValue();
  if (local !== code) {
    isApplyingRemote = true;
    const cursor = editor.getCursor();
    editor.setValue(code);
    try { editor.setCursor(cursor); } catch (e) {}
    isApplyingRemote = false;
  }
});

// TYPING INDICATOR
let typing = false;
let typingTimeout = null;
editor.on("keydown", () => {
  if (!typing) { typing = true; socket.emit("typing", true); }
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => { typing = false; socket.emit("typing", false); }, 1000);
});

const typingStatus = document.getElementById("typingStatus");
socket.on("typing", ({ id, username: who, typing }) => {
  typingStatus.textContent = typing ? `${who} is typing...` : "";
});

// PRESENCE / USERS
const usersList = document.getElementById("usersList");
let remoteCursors = {};

function pickTextColor(bg) {
  if (!bg) return "#fff";
  const c = bg.replace("#","");
  const r = parseInt(c.substr(0,2),16), g = parseInt(c.substr(2,2),16), b = parseInt(c.substr(4,2),16);
  const brightness = (r*299 + g*587 + b*114)/1000;
  return brightness > 125 ? "#000" : "#fff";
}

function renderUsers(users) {
  usersList.innerHTML = "";
  Object.keys(users).forEach(id => {
    const u = users[id];
    const li = document.createElement("li");
    const dot = document.createElement("span");
    dot.className = "user-dot";
    dot.style.background = u.color;
    const name = document.createElement("span");
    name.textContent = u.username + (id === socket.id ? " (you)" : "");
    li.appendChild(dot);
    li.appendChild(name);
    usersList.appendChild(li);
  });
}

socket.on("users", (users) => {
  renderUsers(users);
});

// CURSOR & SELECTIONS handling
socket.on("cursorUpdate", ({ id, username: who, color, payload }) => {
  if (remoteCursors[id] && remoteCursors[id].markers) {
    try { remoteCursors[id].markers.forEach(m => m.clear && m.clear()); } catch(e){}
  }
  const markers = [];
  if (payload.selection && payload.selection.from && payload.selection.to) {
    const from = payload.selection.from;
    const to = payload.selection.to;
    const mark = editor.getDoc().markText(from, to, { className: "remote-selection", css: `background:${color}33` });
    markers.push(mark);
  }
  if (payload.cursor) {
    const pos = payload.cursor;
    const cursorEl = document.createElement("span");
    cursorEl.className = "remote-cursor";
    cursorEl.style.borderLeftColor = color;
    const nameEl = document.createElement("div");
    nameEl.className = "remote-name";
    nameEl.style.background = color;
    nameEl.style.color = pickTextColor(color);
    nameEl.textContent = who;
    cursorEl.appendChild(nameEl);
    const bm = editor.getDoc().setBookmark(pos, { widget: cursorEl, insertLeft: true });
    markers.push(bm);
  }
  remoteCursors[id] = { markers };
});

let lastCursorSent = 0;
function sendCursorUpdate() {
  const now = Date.now();
  if (now - lastCursorSent < 100) return;
  lastCursorSent = now;
  const cursor = editor.getCursor();
  const sel = editor.listSelections()[0];
  const payload = {
    cursor: cursor,
    selection: sel ? { from: sel.anchor, to: sel.head } : null
  };
  socket.emit("cursorUpdate", payload);
}

editor.on("cursorActivity", sendCursorUpdate);
editor.on("mousedown", () => setTimeout(sendCursorUpdate, 50));
editor.on("mouseup", sendCursorUpdate);

socket.on("userDisconnected", ({ id }) => {
  if (remoteCursors[id] && remoteCursors[id].markers) {
    remoteCursors[id].markers.forEach(m => m.clear && m.clear());
    delete remoteCursors[id];
  }
});

