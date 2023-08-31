import api from "../api/config";


export const getUsers = async () => { 
    let data = await api.get('users').then(result => result.data);
    return data;
};

export const create = async (user) => { 
    let data = await api.post('users',user).then(result => result.data);
    return data;
};

export const getByIdUser = async (userId) => {
    let data = await api.get(`users/${userId}`).then(result => result.data);
    return data;
}