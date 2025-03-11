import axios from "axios";

export default class ApiService {
    static BASE_URL = "http://localhost:8081";

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    /** AUTH */

    /* Register a new user */
    static async registerUser(registration) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/register`, registration);
            return response.data;
        } catch (error) {
            console.error('Error registering user:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Login a registered user */
    static async loginUser(loginDetails) {
        try {
            const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails);
            localStorage.setItem('token', response.data.token); // Save token
            localStorage.setItem('role', response.data.role); // Save role
            return response.data;
        } catch (error) {
            console.error('Error logging in:', error.response?.data || error.message);
            throw error;
        }
    }

    /** USERS */

    /* Get all users */
    static async getAllUsers() {
        try {
            const response = await axios.get(`${this.BASE_URL}/users/all`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get user profile */
    static async getUserProfile() {
        try {
            const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get a single user by ID */
    static async getUser(userId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get user bookings by user ID */
    static async getUserBookings(userId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user bookings:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Delete a user by ID */
    static async deleteUser(userId) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error.response?.data || error.message);
            throw error;
        }
    }

    /** ROOM */

    /* Add a new room */
    static async addRoom(formData) {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debugging: Log the token
            const result = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return result.data;
        } catch (error) {
            console.error('Error adding room:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get all available rooms */
    static async getAllAvailableRooms() {
        try {
            const result = await axios.get(`${this.BASE_URL}/rooms/all-available-rooms`);
            return result.data;
        } catch (error) {
            console.error('Error fetching available rooms:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get available rooms by date and type */
    static async getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
        try {
            const result = await axios.get(
                `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
            );
            return result.data;
        } catch (error) {
            console.error('Error fetching available rooms:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get all room types */
    static async getRoomTypes() {
        try {
            const response = await axios.get(`${this.BASE_URL}/rooms/types`);
            return response.data;
        } catch (error) {
            console.error('Error fetching room types:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get all rooms */
    static async getAllRooms() {
        try {
            const result = await axios.get(`${this.BASE_URL}/rooms/all`);
            return result.data;
        } catch (error) {
            console.error('Error fetching rooms:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get a room by ID */
    static async getRoomById(roomId) {
        try {
            const result = await axios.get(`${this.BASE_URL}/rooms/room-by-id/${roomId}`);
            return result.data;
        } catch (error) {
            console.error('Error fetching room:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Delete a room by ID */
    static async deleteRoom(roomId) {
        try {
            const result = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
                headers: this.getHeader()
            });
            return result.data;
        } catch (error) {
            console.error('Error deleting room:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Update a room */
    static async updateRoom(roomId, formData) {
        try {
            const result = await axios.put(`${this.BASE_URL}/rooms/update/${roomId}`, formData, {
                headers: {
                    ...this.getHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            return result.data;
        } catch (error) {
            console.error('Error updating room:', error.response?.data || error.message);
            throw error;
        }
    }

    /** BOOKING */

    /* Book a room */
    static async bookRoom(roomId, userId, booking) {
        try {
            const response = await axios.post(`${this.BASE_URL}/bookings/book-room/${roomId}/${userId}`, booking, {
                headers: this.getHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error booking room:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get all bookings */
    static async getAllBookings() {
        try {
            const result = await axios.get(`${this.BASE_URL}/bookings/all`, {
                headers: this.getHeader()
            });
            return result.data;
        } catch (error) {
            console.error('Error fetching bookings:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Get booking by confirmation code */
    static async getBookingByConfirmationCode(bookingCode) {
        try {
            const result = await axios.get(`${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`);
            return result.data;
        } catch (error) {
            console.error('Error fetching booking:', error.response?.data || error.message);
            throw error;
        }
    }

    /* Cancel a booking */
    static async cancelBooking(bookingId) {
        try {
            const result = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`, {
                headers: this.getHeader()
            });
            return result.data;
        } catch (error) {
            console.error('Error canceling booking:', error.response?.data || error.message);
            throw error;
        }
    }

    /** AUTHENTICATION CHECKER */

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }
}