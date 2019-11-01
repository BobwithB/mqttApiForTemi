import path from "path";

let config = {};

config.logFileDir = path.join(__dirname, '../../log');
config.logFileName = process.env.logFileName || 'app.log';
config.dbHost = process.env.dbHost || 'localhost';
config.dbPort = process.env.dbPort || '27017';
config.dbName = process.env.dbName || 'mqtt';
config.serverPort = process.env.PORT || 3000;

export default config;