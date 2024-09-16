import { storeRawRequest, storeRequestBody } from "./mongoService";
import { storeRequestDetails } from "./postgresService";

const handleRequest = async (req) => {
  try {
    // Reconstruct the request body into a string
    let rawBody = '';
    req.on('data', (chunk) => {
      rawBody += chunk;
    });

    // Reconstruct the entire raw request into a string
    req.on('end', async () => {
      const fullRawRequest = `${req.method} ${req.url} HTTP/${req.httpVersion}\r\n` +
        Object.entries(req.headers).map(([key, value]) => `${key}: ${value}`).join('\r\n') +
        '\r\n\r\n' +
        rawBody;

      // console.log(rawBody);
      // console.log(fullRawRequest);
      
      // Save raw request and body to Mongo
      const mongoRequestId = (await storeRawRequest(fullRawRequest)).toString();
      const mongoBodyId = (await storeRequestBody(rawBody)).toString();

      // console.log(mongoRequestId);
      // console.log(mongoBodyId);

      const method = req.method;
      const path = req.path;
      const headers = Object.entries(req.headers)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\r\n') +
                        '\r\n\r\n'
      const receivedAt = new Date().toISOString();

      // console.log(method);
      // console.log(path);
      // console.log(headers);
      // console.log(receivedAt);

      // Save request details to PostgreSQL bin
      await storeRequestDetails(3, method, path, headers, receivedAt, mongoRequestId, mongoBodyId);
    });
  } catch (error) {
    console.error('Error handling request:', error);
  }
};

export { handleRequest};