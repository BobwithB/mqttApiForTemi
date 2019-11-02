import mqtt from "mqtt";
import logger from '../core/logger/app-logger'
const mqttService = {};
let client = {};
mqttService.connect =  () => {
    const mqtt_url = process.env.mqttUrl;
    const topic = process.env.mqttTopic;
    const mqttConfig = {port:process.env.mqttPort,username:process.env.mqttUsername,password:process.env.mqttPassword};
    client =  mqtt.connect(mqtt_url,mqttConfig);
    client.subscribe(topic, function (err) {
    })
    client.on('message', function (topics, message) {
        logger.info("port(" + process.env.PORT + ") receive a massage from topic("+topic+"):"+message.toString())
    });
}
export default mqttService;