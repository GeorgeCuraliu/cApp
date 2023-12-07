const WebSocket = window.WebSocket;
const websocket = new WebSocket(`ws://localhost:3009/chat`);
export default websocket;