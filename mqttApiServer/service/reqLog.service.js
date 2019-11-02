import reqLog from '../models/reqLog.model'
import logger from '../core/logger/app-logger'
import  reqLogModel from '../models/reqLog.model'
import  mqttService from './mqtt.service'

const service = {};

service.getAll = async (req, res) => {
    mqttService.sendMsg();
    try {
        const logs = await reqLog.getAll();
        res.send(logs);
    }
    catch(err) {
        logger.error('Error in getting all logs - ' + err);
        res.send('Got error in getAll');
    }
}
service.inserLogs = async (logs) => {
    try {
        const data = reqLogModel({
            req: logs
        });
       await reqLog.inserLogs(data);
    }
    catch(err) {
        logger.error('Error in inserLogs - ' + err);
    }
}

export default service;