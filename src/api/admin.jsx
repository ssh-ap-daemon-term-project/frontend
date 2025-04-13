import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true
});

export const getAllHotels = async () => {
    return await API.get('/admin/hotels');
};

export const getHotelById = async (id) => {
    return await API.get(`/admin/hotels/${id}`);
};

export const getHotelRooms = async (hotelId) => {
    return await API.get(`/admin/hotels/${hotelId}/rooms`);
};

export const getHotelReviews = async (hotelId) => {
    return await API.get(`/admin/hotels/${hotelId}/reviews`);
};

export const updateHotel = async (id, hotelData) => {
    return await API.put(`/admin/hotels/${id}`, hotelData);
};

export const deleteHotel = async (id) => {
    return await API.delete(`/admin/hotels/${id}`);
};

export const getAllCustomers = async () => {
    return await API.get('/admin/customers');
};

export const getCustomerById = async (id) => {
    return await API.get(`/admin/customers/${id}`);
};

export const updateCustomer = async (id, customerData) => {
    return await API.put(`/admin/customers/${id}`, customerData);
};

export const deleteCustomer = async (id) => {
    return await API.delete(`/admin/customer/${id}`);
};

export const getCustomerBookings = async (customerId) => {
    return await API.get(`/admin/customers/${customerId}/bookings`);
};

export const getCustomerRideBookings = async (customerId) => {
    return await API.get(`/admin/customers/${customerId}/ride-bookings`);
};

export const getCustomerReviews = async (customerId) => {
    return await API.get(`/admin/customers/${customerId}/reviews`);
};

export const getCustomerItineraries = async (customerId) => {
    return await API.get(`/admin/customers/${customerId}/itineraries`);
};

export const getDashboardData = async () => {
    return await API.get('/admin/dashboard-data');
}

export const getDrivers = async () => {
    return await API.get('/admin/drivers');
}

export const getDriver = async (driverId) => {
    return await API.get(`/admin/drivers/${driverId}`);
}

export const addDriver = async (driverData) => {    
    return await API.post('/admin/drivers', driverData);
}

export const updateDriver = async (id, driverData) => {
    return await API.put(`/admin/drivers/${id}`, driverData);
}

export const deleteDriver = async (id) => {
    return await API.delete(`/admin/drivers/${id}`);
}

export const getDriverRideBookings = async (driverId) => {
    return await API.get(`/admin/drivers/${driverId}/ride-bookings`);
};

export const getAllRoomBookings = async () => {
    return await API.get('/admin/bookings/rooms');
};