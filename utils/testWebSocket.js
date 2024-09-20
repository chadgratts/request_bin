const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/api/bin/jwm187dsq8xt');

ws.on('open', () => {
    console.log('WebSocket connection established');
});

ws.on('message', (message) => {
    console.log('Message from server:', message);
});

ws.on('close', () => {
    console.log('WebSocket connection closed');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});
