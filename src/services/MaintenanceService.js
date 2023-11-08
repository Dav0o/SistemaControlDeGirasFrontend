import api from "../api/config";


export const getMaintenance = async () => {
  let data = await api.get('maintenances').then(result => result.data);
  return data;
};

export const create = async (maintenance) => { 
    if (maintenance.id) {
        let data = await api.put(`maintenances/${maintenance.id}`, maintenance).then(result => result.data);
        return data;
    } else {
        let data = await api.post('maintenances', maintenance).then(result => result.data);
        return data;
    }
};

export const deleteMaintenance = async (maintenanceId) => {
    try {
      const response = await api.delete(`maintenances/${maintenanceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };