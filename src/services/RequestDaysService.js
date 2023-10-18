import api from "../api/config";

export const create = async (requestDays) => { 
    if (requestDays.id) {
        let data = await api.put(`requestsDays/${requestDays.id}`, requestDays).then(result => result.data);
        return data;
    } else {
        let data = await api.post('requestsDays', requestDays).then(result => result.data);
        return data;
    }
};

export const getRequestDays = async () => {
    let data = await api.get('requestsDays').then(result => result.data);
    return data;
};

export const getByIdRequestDays = async (requestDaysId) => {
    let data = await api.get(`requestsDays/${requestDaysId}`).then(result => result.data);
    return data;
}



