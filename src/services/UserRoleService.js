import api from "../api/config";



export const getUserRole = async () => { 
    let data = await api.get('user_Role').then(result => result.data);
    return data;
};

export const createUser_Roles = async (user_Role) => {
    let data = await api.post('User_Roles',user_Role).then(result => result.data);
    return data;

}



