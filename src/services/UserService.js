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
        try {
            let data = await api.post('users', user).then(result => result.data);
            return data;
        } catch (error) {
            if (error.response.status === 409) {
                return { error: 'El DNI del usuario ya se encuentra registrado' };
            } else {
                return { error: 'Hubo un error al actualizar el usuario' };
            }
        }
    }

};

export const getByIdUser = async (userId) => {
    let data = await api.get(`users/${userId}`).then(result => result.data);
    return data;
};

export const getUserByRole = async (userRole) => {
    let data = await api.get(`users/usersbyrole/${userRole}`).then(result => result.data);
    return data;
}

export const changePassword = async (user) => {
    let data = await api.patch(`users`, user).then(result =>  result.data);
    return data;
}

export const getUsersDriver = async () => {
    let data = await api.get(`/users/usersbyrole/Chofer`).then(result => result.data);
    return data;
}

