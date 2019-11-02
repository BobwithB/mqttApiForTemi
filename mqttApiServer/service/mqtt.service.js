import mqtt from "mqtt";
const mqttService = {};
let client = {};
const mqtt_url = 'mqtt:tailor.cloudmqtt.com';
const topic = 'myCloudMQTT';
import logger from '../core/logger/app-logger'
mqttService.connect =  () => {
    client =  mqtt.connect(mqtt_url,{port:'18558',username:'fusdnbdl',password:'J4A79NQv35ke'});
    mqttService.reseiveMsg();
}
mqttService.sendMsg =  (req, res) => {
    let msg = "this is from bob's msg";
        client.subscribe(topic, function (err) {
            logger.info(msg);
            if (!err) {
                client.publish(topic, msg)
            }
        })
    res.send("0000");
}
mqttService.reseiveMsg =  () => {
    client.on('message', function (topic, message) {
        console.log("get msg = "+message.toString())
    })
}


export default mqttService;