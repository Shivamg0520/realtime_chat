// server.js

const express = require('express');
const http = require('http'); // Node.js built-in HTTP module
const { Server } = require('socket.io'); // Import Server from socket.io

const app = express();
const server = http.createServer(app); // Create an HTTP server using Express app
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in development.
                     // In production, specify your client's origin (e.g., "http://localhost:3000")
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
// This will serve our index.html, style.css, and script.js
app.use(express.static('public'));

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for 'chat message' event from client
    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        // Broadcast the message to all connected clients
        io.emit('chat message', msg);
    });

    // Listen for 'disconnect' event
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open your browser at http://localhost:${PORT}`);
});