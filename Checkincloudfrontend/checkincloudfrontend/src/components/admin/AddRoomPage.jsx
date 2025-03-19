import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const AddRoomPage = () => {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomType: '', // Initialize with empty string
        roomPrice: '',
        roomDescription: '',
        photo: null,
    });

    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fileSize, setFileSize] = useState(0);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

    useEffect(() => {
        // Check if user is authenticated and is admin
        if (!ApiService.isAuthenticated()) {
            setError('Your session has expired. Please log in again.');
            setTimeout(() => navigate('/login'), 3000);
            return;
        }
        
        if (!ApiService.isAdmin()) {
            setError('Admin privileges required to access this page.');
            setTimeout(() => navigate('/'), 3000);
            return;
        }
        
        const fetchRoomTypes = async () => {
            try {
                const types = await ApiService.getRoomTypes();
                setRoomTypes(types);
            } catch (error) {
                console.error('Error fetching room types:', error.message);
                setError('Failed to load room types. Please refresh the page.');
            }
        };
        
        fetchRoomTypes();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRoomTypeChange = (e) => {
        if (e.target.value === 'new') {
            setNewRoomType(true);
            setRoomDetails(prevState => ({ ...prevState, roomType: '' }));
        } else {
            setNewRoomType(false);
            setRoomDetails(prevState => ({ ...prevState, roomType: e.target.value }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            // Check file size
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
                setTimeout(() => setError(''), 5000);
                return;
            }
            
            setFileSize(selectedFile.size);
            setPreview(URL.createObjectURL(selectedFile));

            // Create a FormData object for the file
            const formData = new FormData();
            formData.append('photo', selectedFile);
            
            setRoomDetails(prevState => ({
                ...prevState,
                photo: selectedFile, // Store the actual file object
            }));
        } else {
            setPreview(null);
            setRoomDetails(prevState => ({ ...prevState, photo: null }));
        }
    };

    const addRoom = async () => {
        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription || !roomDetails.photo) {
            setError('All room details and an image must be provided.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (!window.confirm('Do you want to add this room?')) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Check if token is valid first
            if (!ApiService.isTokenValid()) {
                setError('Your session has expired. Please log in again.');
                setTimeout(() => {
                    ApiService.logout();
                    navigate('/login');
                }, 3000);
                return;
            }
            
            // Create a FormData object
            const formData = new FormData();
            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);
            formData.append('photo', roomDetails.photo);
            
            const result = await ApiService.addRoom(formData);

            if (result && result.statusCode === 200) {
                setSuccess('Room added successfully.');
                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
        } catch (error) {
            console.error('Error adding room:', error);
            
            // Check if error is due to token expiration
            if (error.message && error.message.includes('token expired')) {
                setError('Your session has expired. Please log in again.');
                setTimeout(() => {
                    ApiService.logout();
                    navigate('/login');
                }, 3000);
                return;
            }
            
            setError(error.response?.data?.message || 
                    'Failed to add room. Please check server connection and try again.');
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="edit-room-container">
            <h2>Add New Room</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <div className="edit-room-form">
                <div className="form-group">
                    {preview && (
                        <div>
                            <img src={preview} alt="Room Preview" className="room-photo-preview" />
                            <p>File size: {(fileSize / 1024).toFixed(2)} KB</p>
                        </div>
                    )}
                    <input
                        type="file"
                        name="roomPhoto"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <small>Maximum file size: 5MB</small>
                </div>

                <div className="form-group">
                    <label>Room Type</label>
                    <select 
                        value={roomDetails.roomType} 
                        onChange={handleRoomTypeChange}
                    >
                        <option value="">Select a room type</option>
                        {roomTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="new">Other (please specify)</option>
                    </select>
                    {newRoomType && (
                        <input
                            type="text"
                            name="roomType"
                            placeholder="Enter new room type"
                            value={roomDetails.roomType}
                            onChange={handleChange}
                        />
                    )}
                </div>
                <div className="form-group">
                    <label>Room Price</label>
                    <input
                        type="number"
                        name="roomPrice"
                        value={roomDetails.roomPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label>Room Description</label>
                    <textarea
                        name="roomDescription"
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                        rows="4"
                    ></textarea>
                </div>
                <button 
                    className="update-button" 
                    onClick={addRoom}
                    disabled={isLoading}
                >
                    {isLoading ? 'Adding...' : 'Add Room'}
                </button>
            </div>
        </div>
    );
};

export default AddRoomPage;