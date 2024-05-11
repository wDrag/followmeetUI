import axios from 'axios';

const ax = axios.create({
    baseURL: import.meta.env.BASE_URL
});

ax.defaults.withCredentials = true;

export default ax;