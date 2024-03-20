import api from "../api/config";


export const getNotices = async () => {
    let data = await api.get('notices').then(result => result.data);
    return data;
};

export const create = async (notice) => { 
    if (notice.id) {
        let data = await api.put(`notices/${notice.id}`, notice).then(result => result.data);
        return data;
    } else {
        let data = await api.post('notices', notice).then(result => result.data);
        return data;
    }
};


export const getByIdNotice = async (noticeId) => {
    let data = await api.get(`notices/${noticeId}`).then(result => result.data);
    return data;
}


export const deleteNotice = async (noticeId) => {
    try {
      const response = await api.delete(`notices/${noticeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const changeStatus = async (id) => {
    let data = await api.patch(`notices/${id}/disable`).then(result => result.data);
    return data;
}
