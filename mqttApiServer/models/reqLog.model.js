import mongoose from 'mongoose';
import mqtt from'mqtt';
const reqLogSchema = mongoose.Schema({
    req: Object
}, {collection : 'logs'});

const reqLogModel = mongoose.model('logs', reqLogSchema);

reqLogModel.getAll = () => {

    var mqtt_url = 'mqtt:tailor.cloudmqtt.com';
    var topic = 'myCloudMQTT';
    var client = mqtt.connect(mqtt_url,{port:'18558',username:'fusdnbdl',password:'J4A79NQv35ke'});

    client.on('connect', function () {
        client.subscribe(topic, function (err) {

            if (!err) {
                client.publish(topic, 'Hello mqtt')
            }
        })
    })

    client.on('message', function (topic, message) {
        console.log(message.toString())
        client.end()
    })

    return reqLogModel.find({});
}
reqLogModel.inserLogs = (logs) => {
    return logs.save();
}
export default reqLogModel;