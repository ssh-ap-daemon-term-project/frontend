import axios from 'axios';

const API = axios.create({
    baseURL: 'https://backend-hktx.onrender.com/api',
    withCredentials: true // allows HTTP-only cookies to be sent
});

export const signup = async (username, email, password, phone, name, address, userType, extraFields = {}) => {
    return await API.post('/auth/signup', { username, email, password, phone, name, address, userType, ...extraFields });
}

export const signin = async (username, password) => {
    return await API.post('/auth/signin', { username, password });
}

export const signout = async () => {
    return await API.get('/auth/signout');
}
