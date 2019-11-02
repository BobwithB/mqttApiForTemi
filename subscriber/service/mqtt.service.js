import mqtt from "mqtt";
const mqttService = {};
let client = {};
const mqtt_url = 'mqtt:farmer.cloudmqtt.com';
const topic = 'demoTopic';
import logger from '../core/logger/app-logger'
mqttService.connect =  () => {
    client =  mqtt.connect(mqtt_url,{port:'13697',username:'fhutekbq',password:'yBUbbRW3ys7Z'});
    client.subscribe(topic, function (err) {
    })
    client.on('message', function (topics, message) {
        logger.info("port(" + process.env.PORT + ") receive a massage from topic("+topic+"):"+message.toString())
    });
}
export default mqttService;