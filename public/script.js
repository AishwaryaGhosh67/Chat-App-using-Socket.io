const socket = io();
let currentRoom = null;
let currentUser = null;
const userColors = new Map();

// Generate random pastel color
function getRandomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 70%)`;
}

function joinRoom() {
  const username = document.getElementById('username').value.trim();
  const room = document.getElementById('roomInput').value.trim();

  if (!username || !room) {
    alert("Please enter a username and room name.");
    return;
  }

  currentRoom = room;
  currentUser = username;

  // Store self color immediately
  if (!userColors.has(username)) {
    userColors.set(username, getRandomColor());
  }

  socket.emit('joinRoom', { username, room });
}

document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();
  const msg = document.getElementById('input').value;
  if (msg && currentRoom) {
    socket.emit('chatMessage', msg);
    document.getElementById('input').value = '';
  }
});

socket.on('message', function (data) {
  const messages = document.getElementById('messages');

  // Assign color to new user if not present
  if (!userColors.has(data.username)) {
    userColors.set(data.username, getRandomColor());
  }

  const color = userColors.get(data.username);

  const li = document.createElement('li');
  li.innerHTML = `<span class="message-username" style="color: ${color}">${data.username}:</span> ${data.text}`;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});
