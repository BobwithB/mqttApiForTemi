import express from "express";
import service from "../service/reqLog.service"
const router = express.Router()

router.get('/allReqLog', (req, res) => {
    service.getAll(req, res);
});
router.post('/allReqLog', (req, res) => {
    service.getAll(req, res);
});

export default router;