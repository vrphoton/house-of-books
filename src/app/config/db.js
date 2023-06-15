const mongoose      = require('mongoose');
const logger        = require('../../app/middleware/log');

require('dotenv').config();

const connect = (url) => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    mongoose.connection.once("open", async () => {
        logger.info("Connected to database");
    });
      
    mongoose.connection.on("error", (err) => {
        logger.error("Error connecting to database  ", err);
    });
}

const disconnect = () => {
    
    if (!mongoose.connection) {
      return;
    }
    
    mongoose.disconnect();

    mongoose.once("close", async () => {
        logger.error("Diconnected from database");
    });

};

module.exports = {
    connect,
    disconnect
}