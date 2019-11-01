import express from "express";
import dotenv from 'dotenv'
import cors from "cors";
import logger from './core/logger/app-logger'
import morgan from 'morgan'
import reqLog from './routes/reqLog.route'
import connectToDb from './db/connect'
import bodyParser from  'body-parser';
import service from './service/reqLog.service'
const tokenList = [
    {"token":"123456789","name":"Bob"},
    {"token":"987654321","name":"Mike"}
]

console.log("NODE_ENV = " + process.env.NODE_ENV)

if(process.env.NODE_ENV === 'dev'){
    dotenv.config({ path: 'config.env.dev' });
} else if(process.env.NODE_ENV === 'prod'){
    dotenv.config({ path: 'config.env.prod' });
} else {
    dotenv.config({ path: 'config.env.dev' });
}

const port = process.env.PORT || 3000;
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
    Logs.token = req.headers.token;
    Logs.name = tokenList.find((item,index,arr)=>{
        return item.token === Logs.token
    }).name;
    if('GET' === req.method){
        requestPayLoad  = JSON.stringify(req.query);
    }else if ('POST' === req.method){
        requestPayLoad  = JSON.stringify(req.body);
    } else {
        requestPayLoad = '';
    }
    Logs.payload =requestPayLoad;
    next();
}
logger.stream = {
    write: function(message, encoding){
        var msArr = message.split(" ");
        Logs.resStatus = msArr[2];
        Logs.time = msArr[3] + msArr[4];
        service.inserLogs(Logs);
        logger.info("req = " + JSON.stringify(Logs));
    }
};

connectToDb();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(defaultFilter);
app.use(cors());
app.use(morgan("dev", { "stream": logger.stream }));
app.use('/reqLog', reqLog);
//Index route
app.get('/', (req, res) => {
    res.send('Invalid endpoint! 404');
});

app.listen(port, () => {
    logger.info('server started - ', port);
});