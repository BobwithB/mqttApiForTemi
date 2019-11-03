import mqtt from "mqtt";
const mqttService = {};
let client = {};
let topic = '';
import logger from '../core/logger/app-logger'
mqttService.connect =  () => {
    const mqtt_url = process.env.mqttUrl;
    topic = process.env.mqttTopic;
    const mqttConfig = {port:process.env.mqttPort,username:process.env.mqttUsername,password:process.env.mqttPassword};
    client =  mqtt.connect(mqtt_url,mqttConfig);
    logger.info(process.pid+' worker Connected to mqtt broker!!!');
    mqttService.receiveMsg();
}
mqttService.sendMsg =  (req, res) => {
    let requestPayLoad = {};
    if('GET' === req.method){
        requestPayLoad  = req.query;
    }else if ('POST' === req.method){
        requestPayLoad  = req.body;
    } else {
        requestPayLoad.msg = 'empty';
    }
    if(!requestPayLoad.msg){
        requestPayLoad.msg = 'empty';
    }
    client.subscribe(topic, function (err) {
        logger.info(process.pid+":worker help send msg:" + JSON.stringify(requestPayLoad.msg));
            if (!err) {
                client.publish(topic, requestPayLoad.msg)
            }
        })
    res.send("SUCCESS!");
}
mqttService.receiveMsg =  () => {
    client.on('message', function (topic, message) {
        logger.info(process.pid+"worker port(" + process.env.PORT + ") receive a massage from topic("+topic+"):"+message.toString())
    })
}
export default mqttService;