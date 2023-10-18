import api from "../api/config";

export const create = async (requestGasoline) => { 
    if (requestGasoline.id) {
        let data = await api.put(`requestsGasoline/${requestGasoline.id}`, requestDays).then(result => result.data);
        return data;
    } else {
        let data = await api.post('requestsGasoline', requestGasoline).then(result => result.data);
        return data;
    }
};

export const getRequestGasoline = async () => {
    let data = await api.get('requestsGasoline').then(result => result.data);
    return data;
};

export const getByIdRequestGasoline = async (requestGasolineId) => {
    let data = await api.get(`requestsGasoline/${requestGasolineId}`).then(result => result.data);
    return data;
}
