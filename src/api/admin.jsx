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

export const createHotel = async (hotelData) => {
    return await API.post('/admin/hotels', hotelData);
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

export const getDashboardData = async () => {
    return await API.get('/admin/dashboard-data');
}

export const getDrivers = async () => {
    return await API.get('/admin/drivers');
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