import api from "../api/config";
import Users from "../pages/users/Users";


export const getUsers = async () => { 
    let data = await api.get('users').then(result => result.data);
    return data;
};

export const create = async (user) => { 
    if (user.id) {
        let data = await api.put('users/${user.id}', user).then(result => result.data);
        return data;
    } else {
        let data = await api.post('users', user).then(result => result.data);
        return data;
    }
    
};

export const getByIdUser = async (userId) => {
    let data = await api.get(`users/${userId}`).then(result => result.data);
    return data;
};