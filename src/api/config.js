import axios from "axios";

const api = axios.create({
    baseURL: 'https://localhost:7209/api/',
});

export default api;