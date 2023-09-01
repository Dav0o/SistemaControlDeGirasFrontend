import api from "../api/config";


export const getVehicles = async () => { 
    let data = await api.get('vehicles').then(result => result.data);
    return data;
};

export const create = async (vehicle) => { 
    let data = await api.post('vehicles',vehicle).then(result => result.data);
    return data;
};
