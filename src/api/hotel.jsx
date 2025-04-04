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

export const getRoomOverview = async (userId) => {
    return await API.get(`/hotel/room-overview?user_id=${userId}`);
}

export const addRoom = async (roomData) => {
    return await API.post('/hotel/add-room', roomData);
}

export const deleteRoom = async (roomId) => {
    return await API.delete(`/hotel/delete-room/${roomId}`);
}

// Add this function to update room count
export const updateRoomCount = async (roomId, totalNumber) => {
    return await API.patch(`/hotel/rooms/${roomId}`, { totalNumber: totalNumber });
}

export const getHotelBookings = async(userId) => {
    return await API.get(`/hotel/hotel-bookings?user_id=${userId}`);
}

export const getHotelReviews = async (userId) => {
    return await API.get(`/hotel/hotel-reviews?user_id=${userId}`);
}