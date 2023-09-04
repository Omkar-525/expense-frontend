import axios from 'axios';

console.log(process.env.API_URL);

const axiosInstance = axios.create({
    baseURL: process.env.API_URL
});

export {axiosInstance};