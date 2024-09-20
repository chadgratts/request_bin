const http = require('http');
const app = require('./app');
const WebSocket = require('ws');
const { initWebSocketForBin } = require('./websockets/webSockets');
const logger = require('./utils/logger');

// Express server
const server = http.createServer(app);
const port = 3000;
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

// Initialize WebSocket connections for bin traffic
const wss = new WebSocket.Server({ server });
initWebSocketForBin(wss);