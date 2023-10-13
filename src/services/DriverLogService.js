import api from "../api/config";

export const create = async (driverLog) => { 
    if (driverLog.id) {
        let data = await api.put(`driverLogs/${driverLog.id}`, driverLog).then(result => result.data);
        return data;
    } else {
        let data = await api.post('driverLogs', driverLog).then(result => result.data);
        return data;
    }
};

export const getDriverLog = async () => { 
    let data = await api.get('driverLogs').then(result => result.data);
    return data;
}

export const getByIdDriverLog = async (driverLogId) => {
    let data = await api.get(`driverLogs/${driverLogId}`).then(result => result.data);
    return data;
}