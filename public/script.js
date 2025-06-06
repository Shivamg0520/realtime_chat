document.addEventListener('DOMContentLoaded', function() {
    // Connect to the Socket.IO server.
    // By default, it connects to the server that served the page (http://localhost:3000)
    const socket = io(); 

    // --- DOM Elements ---
    const usernameInput = document.getElementById('usernameInput');
    const setUsernameBtn = document.getElementById('setUsernameBtn');
    const messagesDiv = document.getElementById('messages');
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const sendButton = messageForm.querySelector('button[type="submit"]');

    // --- State Variables ---
    let username = '';

    // --- Utility Function to Add Message to UI ---
    function addMessageToUI(data, isOwnMessage = false) {
        const messageItem = document.createElement('div');
        messageItem.classList.add('message-item');

        if (isOwnMessage) {
            messageItem.classList.add('own-message');
        }

        const usernameSpan = document.createElement('span');
        usernameSpan.classList.add('username');
        usernameSpan.textContent = data.username;

        const textNode = document.createTextNode(data.message);

        messageItem.appendChild(usernameSpan);
        messageItem.appendChild(textNode);
        messagesDiv.appendChild(messageItem);

        // Scroll to the bottom of the messages div
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // --- Event Listeners ---

    // Set Username Logic
    setUsernameBtn.addEventListener('click', () => {
        const inputUsername = usernameInput.value.trim();
        if (inputUsername) {
            username = inputUsername;
            usernameInput.disabled = true;
            setUsernameBtn.disabled = true;
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus(); // Focus on message input for immediate typing
            addMessageToUI({ username: 'System', message: `Welcome, ${username}! You can now chat.` });
            console.log(`Username set to: ${username}`);
        } else {
            alert('Please enter a username.');
        }
    });

    // Handle form submission for sending messages
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission (page reload)

        const message = messageInput.value.trim();
        if (message && username) {
            // Create a message object
            const messageData = {
                username: username,
                message: message
            };
            // Emit 'chat message' event to the server
            socket.emit('chat message', messageData);
            addMessageToUI(messageData, true); // Display own message immediately
            messageInput.value = ''; // Clear input field
        }
    });

    // Listen for incoming 'chat message' from the server
    socket.on('chat message', (data) => {
        // Only display if it's not our own message (we already displayed ours)
        if (data.username !== username) {
            addMessageToUI(data);
        }
    });

    // Optional: Handle server disconnect/reconnect messages
    socket.on('disconnect', () => {
        addMessageToUI({ username: 'System', message: 'You have been disconnected. Trying to reconnect...' });
    });

    socket.on('connect', () => {
        addMessageToUI({ username: 'System', message: 'Connected to chat.' });
    });
});