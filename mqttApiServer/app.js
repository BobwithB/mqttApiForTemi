import express from "express";
import dotenv from 'dotenv'
import cors from "cors";
import logger from './core/logger/app-logger'
import morgan from 'morgan'
import reqLog from './routes/reqLog.route'
import mqtt from './routes/mqtt.route'
import connectToDb from './db/connect'
import bodyParser from  'body-parser';
import request from  'request';
import service from './service/reqLog.service'
import mqttService from './service/mqtt.service'
var path = require('path');
// a simple token list here
const tokenList = [
    {"token":"123456789","name":"Bob"},
    {"token":"987654321","name":"Mike"}
]
// load by env
if(process.env.NODE_ENV === 'dev'){
    dotenv.config({ path: 'config.env.dev' });
} else if(process.env.NODE_ENV === 'prod'){
    dotenv.config({ path: 'config.env.prod' });
} else {
    dotenv.config({ path: 'config.env.dev' });
}
// if there config the PORT, make sure we have 3000 default port here!
const port = process.env.PORT || 3000;
// log object formate
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
// put a filter here to get every request come to this api server
const defaultFilter = function (req, res, next) {
    let requestPayLoad  = '';
    Logs.ip = req.ip;
    Logs.host = req.hostname;
    Logs.url = req.url;
    Logs.method = req.method;

    console.log("req.url = " + req.url);
    if('GET' === req.method){
        requestPayLoad  = JSON.stringify(req.query);
    }else if ('POST' === req.method){
        requestPayLoad  = JSON.stringify(req.body);
    } else {
        requestPayLoad = '';
    }
    Logs.payload =requestPayLoad;
    if("/" === Logs.url || "/error" === Logs.url || "/reqLog/allReqLog" === Logs.url){
        // white list can go to next directly
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
        // here combine the filter massage, can get the result or the request, all store in mongodb
        Logs.resStatus = msArr[2];
        Logs.time = msArr[3] + msArr[4];
        service.inserLogs(Logs);
        logger.info("req = " + JSON.stringify(Logs));
        Logs = {};
    }
};
const promise = new Promise(function (resolve, reject) {
    request(process.env.configURL, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            resolve(body);
        }else{
            reject(body)
        }
    });
});
// why i use Promise here is because i make sure configuration init before connectToDb and mqtt connect, they need the configuration data
promise.then(function(data){
    data = JSON.parse(data);
    process.env = {...process.env,...data}
    console.log(process.pid + " worker done with config init");
    connectToDb();
    mqttService.connect();
},function(err){
    console.log("config err="+err);
});
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
//Index route
app.get('/error', (req, res) => {
    res.render('error');
});
// start multiple process cpu
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', () => {
        console.log(`woker ${process.pid} out`);
    });
} else {
    const server = app.use(express.static(__dirname)).listen(port, 'localhost', () => {
        const host = server.address().address;
        const port = server.address().port;
        console.log("worker %s listen to http://%s:%s", process.pid, host, port);
    });
}
