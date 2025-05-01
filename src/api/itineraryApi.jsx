import axios from 'axios';

const API = axios.create({
    baseURL: 'https://backend-hktx.onrender.com/api',
    withCredentials: true // allows HTTP-only cookies to be sent
});

// Itinerary endpoints
export const getCustomerItineraries = async () => {
    return await API.get('/customer_itineraries');
};

export const getItineraryById = async (id) => {
    return await API.get(`/customer_itineraries/${id}`);
};

export const createItinerary = async (itineraryData) => {
    return await API.post('/customer_itineraries', itineraryData);
};

export const updateItinerary = async (id, itineraryData) => {
    return await API.put(`/customer_itineraries/${id}`, itineraryData);
};

export const deleteItinerary = async (id) => {
    return await API.delete(`/customer_itineraries/${id}`);
};

// Schedule item endpoints
export const addScheduleItem = async (itineraryId, scheduleData) => {
    return await API.post(`/customer_itineraries/${itineraryId}/schedule`, scheduleData);
};

export const updateScheduleItem = async (itineraryId, itemId, scheduleData) => {
    return await API.put(`/customer_itineraries/${itineraryId}/schedule/${itemId}`, scheduleData);
};

export const deleteScheduleItem = async (itineraryId, itemId) => {
    return await API.delete(`/customer_itineraries/${itineraryId}/schedule/${itemId}`);
};

// Room item endpoints
export const addRoomToItinerary = async (itineraryId, roomData) => {
    return await API.post(`/customer_itineraries/${itineraryId}/rooms`, roomData);
};

export const updateRoomDates = async (itineraryId, itemId, roomData) => {
    return await API.put(`/customer_itineraries/${itineraryId}/rooms/${itemId}`, roomData);
};

export const removeRoomFromItinerary = async (itineraryId, itemId) => {
    return await API.delete(`/customer_itineraries/${itineraryId}/rooms/${itemId}`);
};

// Ride booking endpoints
export const bookRide = async (itineraryId, rideData) => {
    return await API.post(`/customer_itineraries/${itineraryId}/rides`, rideData);
};

export const updateRideBooking = async (itineraryId, rideId, rideData) => {
    return await API.put(`/customer_itineraries/${itineraryId}/rides/${rideId}`, rideData);
};

export const cancelRide = async (itineraryId, rideId) => {
    return await API.delete(`/customer_itineraries/${itineraryId}/rides/${rideId}`);
};

// Driver service endpoint
export const toggleDriverService = async (itineraryId, driverService) => {
    return await API.put(`/customer_itineraries/${itineraryId}/driver-service`, { driverService });
};

// Room availability endpoint
export const getAvailableRooms = async (startDate, endDate, city, guests) => {
    return await API.get('/customer_itineraries/available-rooms', {
        params: {
            start_date: startDate,
            end_date: endDate,
            city,
            guests
        }
    });
};

// Review endpoints
export const submitHotelReview = async (reviewData) => {
    return await API.post('/reviews/hotels', reviewData);
};