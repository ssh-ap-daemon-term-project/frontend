import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true // allows HTTP-only cookies to be sent
});

export const signup = async (username, email, password, phone, name, dob, gender, address) => {
    return await API.post('/auth/signup', { username, email, password, phone, name, dob, gender, address });
}

export const signin = async (username, password) => {
    return await API.post('/auth/signin', { username, password });
}
