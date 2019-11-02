import express from "express";
import dotenv from 'dotenv'
import cors from "cors";
import logger from './core/logger/app-logger'
import morgan from 'morgan'
import reqLog from './routes/reqLog.route'
import mqtt from './routes/mqtt.route'
import connectToDb from './db/connect'
import bodyParser from  'body-parser';
import service from './service/reqLog.service'
import mqttService from './service/mqtt.service'
var path = require('path');
const tokenList = [
    {"token":"123456789","name":"Bob"},
    {"token":"987654321","name":"Mike"}
]


if(process.env.NODE_ENV === 'dev'){
    dotenv.config({ path: 'config.env.dev' });
} else if(process.env.NODE_ENV === 'prod'){
    dotenv.config({ path: 'config.env.prod' });
} else {
    dotenv.config({ path: 'config.env.dev' });
}

const port = process.env.PORT || 3000;
console.log("********8I am api server************("+port+")");

let Logs = {
    ip:'',
    host:'',
    token:'',
    user:'',
    payload:'',
    url:'',
    resStatus:'',
    method:'',
    time:'',
}
const defaultFilter = function (req, res, next) {
    let requestPayLoad  = '';
    Logs.ip = req.ip;
    Logs.host = req.hostname;
    Logs.url = req.url;
    Logs.method = req.method;

    if('GET' === req.method){
        requestPayLoad  = JSON.stringify(req.query);
    }else if ('POST' === req.method){
        requestPayLoad  = JSON.stringify(req.body);
    } else {
        requestPayLoad = '';
    }
    Logs.payload =requestPayLoad;
    if("/" === Logs.url || "/error" === Logs.url || "/reqLog/allReqLog" === Logs.url){
        next();
    }else{
        if(!req.headers.token || !tokenList.find((item,index,arr)=>{
                return item.token === req.headers.token
            })){
            logger.error("illegal in token check,will go to 404 page");
            res.redirect('/error');
        }else{
            Logs.token = req.headers.token;
            Logs.name = tokenList.find((item,index,arr)=>{
                return item.token === Logs.token
            }).name;
            next();
        }
    }

}
logger.stream = {
    write: function(message, encoding){
        var msArr = message.split(" ");
        Logs.resStatus = msArr[2];
        Logs.time = msArr[3] + msArr[4];
        service.inserLogs(Logs);
        logger.info("req = " + JSON.stringify(Logs));
        Logs = {};
    }
};

connectToDb();
mqttService.connect();
// mqttService.receiveMsg();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(defaultFilter);
app.use(cors());
app.use(morgan("dev", { "stream": logger.stream }));
app.use('/reqLog', reqLog);
app.use('/mqtt', mqtt);
//Index route
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/error', (req, res) => {
    res.render('error');
});

app.listen(port, () => {
    logger.info('server started - ', port);
});