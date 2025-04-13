import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true
});

export const getCompletedTrips = async (userId) => {
    return await API.get(`/driver/completed-trips/${userId}/`);
};
