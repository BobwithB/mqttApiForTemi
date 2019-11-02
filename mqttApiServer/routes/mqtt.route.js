import express from "express";
import mqttService from "../service/mqtt.service"
const router = express.Router()

router.get('/publish', (req, res) => {
    mqttService.sendMsg(req, res);
});
router.post('/publish', (req, res) => {
    mqttService.sendMsg(req, res);
});

export default router;