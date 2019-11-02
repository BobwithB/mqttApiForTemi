import express from "express";
import dotenv from 'dotenv'
import cors from "cors";
import logger from './core/logger/app-logger'
import mqttService from './service/mqtt.service'
import request from 'request'


if(process.env.NODE_ENV === 'dev'){
    dotenv.config({ path: 'config.env.dev' });
} else if(process.env.NODE_ENV === 'prod'){
    dotenv.config({ path: 'config.env.prod' });
} else {
    dotenv.config({ path: 'config.env.dev' });
}

const port = process.env.PORT || 3000;
console.log("********8I am api subscriber************("+port+")");

const promise = new Promise(function (resolve, reject) {
    request(process.env.configURL, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            resolve(body);
        }else{
            reject(body)
        }
    });
});
promise.then(function(data){
    console.log("config data="+data);
    data = JSON.parse(data);
    process.env = {...process.env,...data}
    mqttService.connect();
},function(err){
    console.log("config err="+err);
});

const app = express();
app.use(cors());

app.listen(port, () => {
    logger.info('subscriber started - ', port);
});