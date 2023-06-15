const winston   = require('winston');

const logger    = winston.createLogger({
    level       : 'info',
    format      : winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports  : [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
  

class Logger {

    info(message, data) {
        logger.info(message);
    }

    error(message) {
        logger.error(message);
    }

    warn(message) {
        logger.warn(message);
    }
}

module.exports = new Logger();