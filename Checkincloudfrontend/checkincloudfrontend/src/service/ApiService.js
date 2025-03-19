import axios from "axios"
import jwtDecode from "jwt-decode"; // Note: You'll need to install this package

export default class ApiService {

    static BASE_URL = "http://localhost:8081"

    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    /**
     * Verifies if the token is valid and not expired
     * @returns {boolean} True if token is valid, false otherwise
     */
    static isTokenValid() {
        const token = localStorage.getItem("token");
        if (!token) return false;
        
        try {
            // Simple token expiration check
            // For JWT tokens, the payload contains an 'exp' timestamp
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) return false;
            
            // Decode the payload
            const payload = JSON.parse(atob(tokenParts[1]));
            // Check if token is expired
            const currentTime = Math.floor(Date.now() / 1000);
            
            return payload.exp > currentTime;
        } catch (e) {
            console.error("Error validating token:", e);
            return false;
        }
    }
    
    /**
     * Verifies if the user is authenticated as an admin
     * @returns {Promise} Promise that resolves if user is admin, rejects otherwise
     */
    static async verifyAdminAuth() {
        if (!this.isTokenValid()) {
            // Token is invalid or expired
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        // Check if user is admin
        if (!this.isAdmin()) {
            throw new Error("You don't have admin privileges.");
        }
        
        // If we reach here, the user is authenticated as admin
        return true;
    }

    /**AUTH */

    /* This  register a new user */
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration)
        return response.data
    }

    /* This  login a registered user */
    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails)
        return response.data
    }

    /***USERS */

    /*  This is  to get the user profile */
    static async getAllUsers() {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader()
        })
        return response.data
    }

    static async getUserProfile() {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {
            headers: this.getHeader()
        })
        return response.data
    }


    /* This is the  to get a single user */
    static async getUser(userId) {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    /* This is the  to get user bookings by the user id */
    static async getUserBookings(userId) {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }


    /* This is to delete a user */
    static async deleteUser(userId) {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader()
        })
        return response.data
    }

    /**ROOM */
    /* This  adds a new room room to the database */
    static async addRoom(formData) {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        const token = localStorage.getItem("token");
        
        // Create headers specifically for multipart/form-data
        const headers = {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type - axios will set it automatically with boundary
        };
        
        const result = await axios.post(`${this.BASE_URL}/rooms/add`, formData, {
            headers: headers
        });
        return result.data;
    }

    /* This  gets all availavle rooms */
    static async getAllAvailableRooms() {
        const result = await axios.get(`${this.BASE_URL}/rooms/all-available-rooms`)
        return result.data
    }


    /* This  gets all availavle by dates rooms from the database with a given date and a room type */
    static async getAvailableRoomsByDateAndType(checkInDate, checkOutDate, roomType) {
        const result = await axios.get(
            `${this.BASE_URL}/rooms/available-rooms-by-date-and-type?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
        )
        return result.data
    }

    /* This  gets all room types from thee database */
    static async getRoomTypes() {
        const response = await axios.get(`${this.BASE_URL}/rooms/types`)
        return response.data
    }
    /* This  gets all rooms from the database */
    static async getAllRooms() {

        const result = await axios.get(`${this.BASE_URL}/rooms/all`)
        console.log(result)
        return result.data
    }
    /* This funcction gets a room by the id */
    static async getRoomById(roomId) {
        const result = await axios.get(`${this.BASE_URL}/rooms/room-by-id/${roomId}`)
        return result.data
    }

    /* This  deletes a room by the Id */
    static async deleteRoom(roomId) {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        const result = await axios.delete(`${this.BASE_URL}/rooms/delete/${roomId}`, {
            headers: this.getHeader()
        })
        return result.data
    }

    /* This updates a room */
    static async updateRoom(roomId, formData) {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        // Handle FormData similar to addRoom method
        let data = formData;
        if (!(formData instanceof FormData)) {
            data = new FormData();
            for (const key in formData) {
                if (key === 'photo' && formData[key] && typeof formData[key] === 'string' && formData[key].startsWith('data:image')) {
                    const base64Response = await fetch(formData[key]);
                    const blob = await base64Response.blob();
                    data.append('photo', blob, 'room-image.jpg');
                } else {
                    data.append(key, formData[key]);
                }
            }
        }
        
        const result = await axios.put(`${this.BASE_URL}/rooms/update/${roomId}`, data, {
            headers: {
                ...this.getHeader(),
                'Content-Type': 'multipart/form-data'
            }
        });
        return result.data;
    }


    /**BOOKING */
    /* This  saves a new booking to the databse */
    static async bookRoom(roomId, userId, booking) {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }

        console.log("USER ID IS: " + userId)

        const response = await axios.post(`${this.BASE_URL}/bookings/book-room/${roomId}/${userId}`, booking, {
            headers: this.getHeader()
        })
        return response.data
    }

    /* This  gets alll bokings from the database */
    static async getAllBookings() {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        const result = await axios.get(`${this.BASE_URL}/bookings/all`, {
            headers: this.getHeader()
        })
        return result.data
    }

    /* This  get booking by the cnfirmation code */
    static async getBookingByConfirmationCode(bookingCode) {
        const result = await axios.get(`${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`)
        return result.data
    }

    /* This is the  to cancel user booking */
    static async cancelBooking(bookingId) {
        // Check token validity before making request
        if (!this.isTokenValid()) {
            this.logout();
            throw new Error("Authentication token expired. Please login again.");
        }
        
        const result = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`, {
            headers: this.getHeader()
        })
        return result.data
    }


    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        // Clear any other auth-related items you might have stored
    }

    static isAuthenticated() {
        return this.isTokenValid();
    }

    static isAdmin() {
        const role = localStorage.getItem('role')
        return role === 'ADMIN'
    }

    static isUser() {
        const role = localStorage.getItem('role')
        return role === 'USER'
    }
}
// export default new ApiService();