import express from "express";
import request from "request";
import mqttService from "../service/mqtt.service"
const router = express.Router()

router.post('/publish', (req, res) => {
    mqttService.sendMsg(req, res);
});
router.post('/topics', (req, res) => {

    request.get('https://customer.cloudmqtt.com/api/instances', {
        'auth': {
            'user': '',
            'pass': '79fcbec9-77de-43b4-a63a-fce628bce76d',
        }
    }, function (err, httpResponse, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(`topics:${data}`)
            res.send(data);
        }
    })
});

export default router;