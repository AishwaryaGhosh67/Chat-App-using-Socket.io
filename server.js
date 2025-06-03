const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from "public"
app.use(express.static('public'));

io.on('connection', socket => {
  console.log('User connected');

  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    socket.username = username;
    socket.room = room;

    socket.to(room).emit('message', {
      username: 'System',
      text: `${username} has joined the room.`,
    });
  });

  socket.on('chatMessage', msg => {
    io.to(socket.room).emit('message', {
      username: socket.username,
      text: msg,
    });
  });

  socket.on('disconnect', () => {
    if (socket.username && socket.room) {
      socket.to(socket.room).emit('message', {
        username: 'System',
        text: `${socket.username} has left the room.`,
      });
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
