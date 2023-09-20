import api from "../api/config";

export const create = async (request) => { 
    if (request.id) {
        let data = await api.put('requests/${request.id}', request).then(result => result.data);
        return data;
    } else {
        let data = await api.post('requests', request).then(result => result.data);
        return data;
    }
    
};

export const endorse = async (request) => {
    let data = await api.put(`Requests/endorse/${request.id}`).then(result => result.data);
    return data;
}

export const getByIdRequest = async (requestId) => {
    let data = await api.get(`requests/${requestId}`).then(result => result.data);
    return data;
}

export const getRequests = async () => { 
    let data = await api.get('requests').then(result => result.data);
    return data;
};