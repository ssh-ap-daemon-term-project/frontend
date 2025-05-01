import axios from 'axios';

const API = axios.create({
    baseURL: 'https://backend-hktx.onrender.com/api',
    withCredentials: true
});

export const getAcceptedTrips = async (userId) => {
    return await API.get(`/driver/accepted-trips/${userId}/`);
};

export const getPendingRequests = async () => {
    return await API.get(`/driver/pending-requests`);
}

export const acceptRide = async (rideId, driverId) => {
    return await API.post(`/driver/accept-ride`, null, {
        params: {
            ride_id: rideId,
            driver_id: driverId
        }
    })
}

export const declineRide = async (rideId, driverId) => {
    return await API.post(`/driver/decline-ride`, null, {
        params: {
            ride_id: rideId,
            driver_id: driverId
        }
    })
}

export const getDriverProfile = async () => {
    return await API.get('/driver/profile');
}

