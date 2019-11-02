import mongoose from 'mongoose';
import mqtt from'mqtt';
const reqLogSchema = mongoose.Schema({
    req: Object
}, {collection : 'logs'});

const reqLogModel = mongoose.model('logs', reqLogSchema);

reqLogModel.getAll = () => {

    return reqLogModel.find({});
}
reqLogModel.inserLogs = (logs) => {
    return logs.save();
}
export default reqLogModel;