import mqtt from "mqtt";
const mqttService = {};
let client = {};
const mqtt_url = 'mqtt:tailor.cloudmqtt.com';
const topic = 'myCloudMQTT';
import logger from '../core/logger/app-logger'
mqttService.connect =  () => {
    client =  mqtt.connect(mqtt_url,{port:'18558',username:'fusdnbdl',password:'J4A79NQv35ke'});
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
        logger.info("port(" + process.env.PORT + ") subscriber receive a massage:"+message.toString())
    })
}
export default mqttService;