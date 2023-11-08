import axios from "axios";

const api = axios.create({
    baseURL: 'https://controldegirasapi.azurewebsites.net//api/',
});


api.interceptors.request.use(
    config => {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
          return config;
      }
  );
  

export default api;