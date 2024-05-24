import api from "../api/config";

export const create = async (workingTime) => { 
    if (workingTime.id) {
        let data = await api.put(`workingTimes/${workingTime.id}`, workingTime).then(result => result.data);
        return data;
    } else {
        let data = await api.post('workingTimes', workingTime).then(result => result.data);
        return data;
    }
};

export const getWorkingTime = async () => { 
    let data = await api.get('workingTimes').then(result => result.data);
    return data;
}

export const getByIdWorkingTime = async (workingTimeId) => {
    let data = await api.get(`workingTimes/${workingTimeId}`).then(result => result.data);
    return data;
}


