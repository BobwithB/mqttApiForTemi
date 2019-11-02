import express from "express";
import dotenv from 'dotenv'
import cors from "cors";
import logger from './core/logger/app-logger'
import mqttService from './service/mqtt.service'



if(process.env.NODE_ENV === 'dev'){
    dotenv.config({ path: 'config.env.dev' });
} else if(process.env.NODE_ENV === 'prod'){
    dotenv.config({ path: 'config.env.prod' });
} else {
    dotenv.config({ path: 'config.env.dev' });
}

const port = process.env.PORT || 3000;
console.log("********8I am api subscriber************("+port+")");


mqttService.connect();

const app = express();
app.use(cors());

app.listen(port, () => {
    logger.info('subscriber started - ', port);
});