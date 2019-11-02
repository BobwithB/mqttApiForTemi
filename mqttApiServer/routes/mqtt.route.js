import express from "express";
import mqttService from "../service/mqtt.service"
const router = express.Router()

router.post('/publish', (req, res) => {
    mqttService.sendMsg(req, res);
});

export default router;