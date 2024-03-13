import api from "../api/config";


export const getVehicles = async () => {
    let data = await api.get('vehicles').then(result => result.data);
    return data;
};

export const create = async (vehicle) => { 
    if (vehicle.id) {
        let data = await api.put(`vehicles/${vehicle.id}`, vehicle).then(result => result.data);
        return data;
    } else {
        let data = await api.post('vehicles', vehicle).then(result => result.data);
        return data;
    }
};

export const getByIdVehicle = async (vehicleId) => {
    let data = await api.get(`vehicles/${vehicleId}`).then(result => result.data);
    return data;
}

export const changeStatus = async (id) => {
    let data = await api.patch(`vehicles/${id}/disable`).then(result);
    return data;
}
