const logger = require('./utils/logger');
const binClients = {};

const addClient = (binEndpoint, client) => {
  if (!binClients[binEndpoint]) {
    binClients[binEndpoint] = [];
  }
  binClients[binEndpoint].push(client);
};

const removeClient = (binEndpoint, client) => {
  if (binClients[binEndpoint]) {
    binClients[binEndpoint] = binClients[binEndpoint].filter(c => {
      return c !== client;
    });

    if (binClients[binEndpoint].length === 0) {
      delete binClients[binEndpoint];
    }
  }
};

const handleIncomingEndpointRequest = (binEndpoint, request) => {
  if (binClients[binEndpoint]) {
    binClients[binEndpoint].forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        // Ensure the request is converted to a JSON string
        try {
          const message = JSON.stringify(request);
          client.send(message);
        } catch (error) {
          logger.error('Error sending message to client:', error);
        }
      } else {
        logger.warn('Client is not open, cannot send message');
      }
    });
  }
};

const initWebSocketForBin = (wss) => {
  wss.on('connection', (ws, req) => {
    const splitPath = req.url.split('/');
    const binEndpoint = splitPath[splitPath.length - 1];

    // Validation
    

    addClient(binEndpoint, ws);

    ws.on('close', () => {
      removeClient(binEndpoint, ws);
    });
  });
};

module.exports = {
  binClients,
  addClient,
  removeClient,
  handleIncomingEndpointRequest,
  initWebSocketForBin,
};