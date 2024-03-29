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
export const update = async (request) => {
    let data = await api.put(`requests`, request).then(result => result.data);
    return data;
}
export const endorse = async (request) => {
    let data = await api.put(`requests/endorse`,request
    ).then(result => result.data);
    return data;
}

export const approve = async (request) => {
    let data = await api.put(`requests/approve`,request
    ).then(result => result.data);
    return data;
}

export const cancel = async (request) => {
    let data = await api.put(`requests/cancel`,request
    ).then(result => result.data);
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

export const getRequestByUserId = async (userId) => {
    let data = await api.get(`requests/byuser/${userId}`).then(result => result.data);
    return data;
}

export const getRequestToEndorse = async () => {
    let data = await api.get(`requests/toEndorse`).then(result => result.data);
    return data;
}

export const getRequestToApprove = async () => {
    let data = await api.get(`requests/toApprove`).then(result => result.data);
    return data;
}

export const getRequestVerified = async () => {
    let data = await api.get(`requests/verified`).then(result => result.data);
    return data;
}


