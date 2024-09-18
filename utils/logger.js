const winston = require('winston');

const customFormat = winston.format.printf(({ timestamp, level, message}) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    customFormat
  ),
  transports: [
    new winston.transports.Console()
  ]
});

module.exports = logger;