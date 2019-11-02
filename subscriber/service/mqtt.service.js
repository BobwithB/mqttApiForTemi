import mqtt from "mqtt";
const mqttService = {};
let client = {};
const mqtt_url = 'mqtt:tailor.cloudmqtt.com';
const topic = 'myCloudMQTT';
import logger from '../core/logger/app-logger'
mqttService.connect =  () => {
    client =  mqtt.connect(mqtt_url,{port:'18558',username:'fusdnbdl',password:'J4A79NQv35ke'});
    client.subscribe(topic, function (err) {
    })
    client.on('message', function (topics, message) {
        logger.info("port("+process.env.PORT+") subscriber receive a massage:"+message.toString())
    });
}
export default mqttService;