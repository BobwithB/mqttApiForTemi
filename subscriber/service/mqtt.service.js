import mqtt from "mqtt";
const mqttService = {};
let client = {};
const mqtt_url = 'mqtt:tailor.cloudmqtt.com';
import logger from '../core/logger/app-logger'
mqttService.connect =  () => {
    const topic = 'myCloudMQTT';
    client =  mqtt.connect(mqtt_url,{port:'18558',username:'fusdnbdl',password:'J4A79NQv35ke'});
    logger.info("99999999----")
    client.subscribe(topic, function (err) {
    })
    client.on('message', function (topics, message) {
        console.log("get msg 222 = "+message.toString())
    });
}
// mqttService.getmasg =  () => {
//
//     client.on('message', function (topic, message) {
//         console.log("get msg 222 = "+message.toString())
//     });
// }


export default mqttService;