import axios from "axios";

const api = axios.create({
    baseURL: 'https://controldegirasapi20240418212308.azurewebsites.net/api',
});


api.interceptors.request.use(
    config => {
      config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
          return config;
      }
  );
  

export default api;