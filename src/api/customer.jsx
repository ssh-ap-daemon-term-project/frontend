import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    withCredentials: true // allows HTTP-only cookies to be sent
});

// Itinerary API calls
// export const createItinerary = async (itineraryData) => {
//     return await API.post('/itineraries', itineraryData);
// };

// export const getCustomerItineraries = async () => {
//     return await API.get('/itineraries');
// };

// export const getItineraryById = async (id) => {
//     return await API.get(`/itineraries/${id}`);
// };

// export const updateItinerary = async (id, itineraryData) => {
//     return await API.put(`/itineraries/${id}`, itineraryData);
// };

// export const deleteItinerary = async (id) => {
//     return await API.delete(`/itineraries/${id}`);
// };

// // Add room to itinerary
// export const addRoomToItinerary = async (itineraryId, roomData) => {
//     return await API.post(`/itineraries/${itineraryId}/rooms`, roomData);
// };

// // Add schedule item to itinerary
// export const addScheduleItem = async (itineraryId, scheduleData) => {
//     return await API.post(`/itineraries/${itineraryId}/schedule`, scheduleData);
// };

// // Get all items for an itinerary
// export const getItineraryItems = async (itineraryId) => {
//     return await API.get(`/itineraries/${itineraryId}/items`);
// };

// book room
// Book a room
export const bookRoom = async (roomItemId, numberOfPersons, customerId) => {
    return await API.post('/customer/itinerary/room/book', {
        room_item_id: roomItemId,
        number_of_persons: numberOfPersons,
        customer_id: customerId
    });
};

export const cancelRoom = async (roomItemId, customerId) => {
    return await API.post('/customer/itinerary/room/cancel', {
        room_item_id: roomItemId,
        customer_id: customerId
    });
}