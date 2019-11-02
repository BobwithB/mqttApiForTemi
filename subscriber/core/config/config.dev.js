import path from "path";

let config = {};

config.logFileDir = path.join(__dirname, '../../log');
config.logFileName = process.env.logFileName || 'app.log';
config.serverPort = process.env.PORT || 3000;

export default config;