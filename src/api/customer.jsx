import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true // allows HTTP-only cookies to be sent
});

export const createItinerary = async (itineraryData) => {
    return await API.post('/customer/create-itinerary', itineraryData);
}