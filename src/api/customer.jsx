import axios from 'axios';

const API = axios.create({
    baseURL: 'https://backend-hktx.onrender.com/api',
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

export const cancelRoomBooking = async (roomItemId) => {
    return await API.delete(`/customer/itinerary/room/cancel/${roomItemId}`);
};

export const getHotels = async (filters = {}) => {
    const { search, priceRange, rating } = filters;

    let params = {};

    if (search) params.search = search;
    if (priceRange && priceRange[0] > 0) params.min_price = priceRange[0];
    if (priceRange && priceRange[1] < 500) params.max_price = priceRange[1];

    if (rating && rating !== "any") {
        params.min_rating = rating;
    }

    return await API.get("/customer/all-hotels", { params });
};

export const getHotelById = async (hotelId) => {
    return await API.get(`/customer/hotel/${hotelId}`);
};

export const bookRoomByRoomId = async (bookingData) => {
    return await API.post("/customer/book-room", bookingData);
};

export const getBookings = async () => {
    return await API.get("/customer/bookings");
};

// Cancel a booking by ID
export const cancelBooking = async (bookingId) => {
    return await API.post(`/customer/bookings/${bookingId}/cancel`);
};

// Post a review for a booking
export const postReview = async (booking_id, rating, comment) => {
    return await API.post(`/customer/bookings/review`, {
        booking_id,
        rating,
        comment
    });
};

// API service for customer reviews

// Get all reviews for the current customer
export const getCustomerReviews = async () => {
    return await API.get('/customer/reviews');
};

// Update a review
export const updateReview = async (reviewId, reviewData) => {
    return await API.put(`/customer/reviews/${reviewId}`, reviewData);
};

// Delete a review
export const deleteReview = async (reviewId) => {
    return await API.delete(`/customer/reviews/${reviewId}`);
};

export const getCustomerProfile = async () => {
    return await API.get('/customer/profile');
};