import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';

const AdminPage = () => {
    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await ApiService.getUserProfile();
                // Check if response has the expected structure before accessing properties
                if (response && response.user && response.user.name) {
                    setAdminName(response.user.name);
                } else {
                    // Set a default value or extract the name from wherever it actually exists in the response
                    console.log('Unexpected API response structure:', response);
                    // If you know the actual structure, you can use it here
                    // For example, if it's response.name instead:
                    // setAdminName(response.name || 'Admin');
                    setAdminName('Admin'); // Default fallback
                }
            } catch (error) {
                console.error('Error fetching admin details:', error.message);
                setAdminName('Admin'); // Set a default name on error
            }
        };
        
        fetchAdminName();
    }, []);
    
    return (
        <div className="admin-page">
            <h1 className="welcome-message">Welcome, {adminName || 'Admin'}</h1>
            <div className="admin-actions">
                <button className="admin-button" onClick={() => navigate('/admin/manage-rooms')}>
                    Manage Rooms
                </button>
                <button className="admin-button" onClick={() => navigate('/admin/manage-bookings')}>
                    Manage Bookings
                </button>
            </div>
        </div>
    );
};

export default AdminPage;