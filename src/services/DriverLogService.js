import api from "../api/config";

export const create = async (driverLog) => { 
        let data = await api.post('driverLogs', driverLog).then(result => result.data);
        return data;
};

export const getDriverLog = async () => { 
    let data = await api.get('driverLogs').then(result => result.data);
    return data;
}

export const getByIdDriverLog = async (driverLogId) => {
    let data = await api.get(`driverLogs/${driverLogId}`).then(result => result.data);
    return data;
}