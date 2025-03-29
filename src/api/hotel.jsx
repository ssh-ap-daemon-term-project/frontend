import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true // allows HTTP-only cookies to be sent
});

export const hotelRooms = async () => {
    return await API.get('/hotel/hotelRoom');
}

export const hotelOccupancy = async () => {
    return await API.get('/hotel/occupancy-rate');
}

export const hotelRevenue = async () => {
    return await API.get('/hotel/revenue');
}

export const hotelActiveBookings = async () => {    
    return await API.get('/hotel/active-bookings');
}

export const hotelAvailabilityChart = async () => {
    return await API.get('/hotel/room-availability-chart');
}

export const getRoomTypeDistribution = async () => {
    return await API.get('/hotel/room-type-distribution');
}

export const getRecentBookings = async () => {
    return await API.get('/hotel/recent-bookings');
}