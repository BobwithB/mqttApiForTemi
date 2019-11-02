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
    logger.info("send msg = " + JSON.stringify(requestPayLoad));
    if(!requestPayLoad.msg){
        requestPayLoad.msg = 'empty';
    }
    client.subscribe(topic, function (err) {
            logger.info("send msg = " + requestPayLoad.msg);
            if (!err) {
                client.publish(topic, requestPayLoad.msg)
            }
        })
    res.send("SUCCESS!");
}
mqttService.receiveMsg =  () => {
    client.on('message', function (topic, message) {
        logger.info("port(" + process.env.PORT + ") receive a massage from topic("+topic+"):"+message.toString())
    })
}
export default mqttService;