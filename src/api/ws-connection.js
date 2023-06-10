//create restAPI that will have the evidence of user connections(should use just the name saved in an array/obj)
//shoudl craete a function for a friend request received while online
//the messages container(shouldtn take much) -- aslo the header for chat with the name and user setting(delete friend, block, view profile)
//if i have time i should also start the settings page(for delete account)

//https://blog.logrocket.com/websocket-tutorial-real-time-node-react/

const { WebSocketServer } = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wss = new WebSocketServer({ server });

const app = express();
const port = 7465;

app.use(cors());
app.use(express.json());



// Object to store active users' WebSocket connections
const activeUsers = {};

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log("aawdasss")
  // Retrieve the userName from the client (assuming it is sent during the connection)
  const { userName } = ws;

  // Store the WebSocket connection with the user's name as the key
  activeUsers[userName] = ws;

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Process the message as needed

    // Example: Send a message to a specific user
    const recipient = 'AAa'; // User to send the message to
    const content = 'Hello, AAa!'; // Message content

    if (activeUsers[recipient]) {
      activeUsers[recipient].send(content);
    }
  });

  // Handle WebSocket connection close
  ws.on('close', () => {
    // Clean up actions when a WebSocket connection is closed
    delete activeUsers[userName];
    console.log('WebSocket connection closed');
  });
});



app.listen(port , () => {
    console.log(`webSocket server port is open on http://localhost:${port}`);
});