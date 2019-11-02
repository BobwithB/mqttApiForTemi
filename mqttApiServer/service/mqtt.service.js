import mqtt from "mqtt";
const mqttService = {};
let client = {};
const mqtt_url = 'mqtt:farmer.cloudmqtt.com';
const topic = 'demoTopic';
import logger from '../core/logger/app-logger'
mqttService.connect =  () => {
    client =  mqtt.connect(mqtt_url,{port:'13697',username:'fhutekbq',password:'yBUbbRW3ys7Z'});
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