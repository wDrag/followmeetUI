import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const instance = axios.create({
    baseURL: env.PROCESS.VITE_API_ENDPOINT
});

instance.defaults.withCredentials = true;