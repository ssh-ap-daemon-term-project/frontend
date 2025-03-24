import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true // allows HTTP-only cookies to be sent
});

export const getAllCustomers = async () => {
    return await API.get('/admin/customers');
};

export const deleteCustomer = async (id) => {
    return await API.delete(`/admin/customer/${id}`);
};