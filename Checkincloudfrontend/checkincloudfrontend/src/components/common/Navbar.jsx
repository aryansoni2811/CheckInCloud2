import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

function Navbar() {
    const [authStatus, setAuthStatus] = useState({
        isAuthenticated: false,
        isAdmin: false,
        isUser: false
    });
    const navigate = useNavigate();

    // Check auth status whenever the component mounts or updates
    useEffect(() => {
        const checkAuth = () => {
            const isAuth = ApiService.isAuthenticated();
            const isAdminRole = ApiService.isAdmin();
            const isUserRole = ApiService.isUser();
            
            setAuthStatus({
                isAuthenticated: isAuth,
                isAdmin: isAdminRole,
                isUser: isUserRole
            });
        };
        
        checkAuth();
        
        // Set up an interval to periodically check auth status
        const interval = setInterval(checkAuth, 5000);
        
        // Clean up the interval when component unmounts
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        const isLogout = window.confirm("Are you sure you really want to logout?");

        if (isLogout) {
            ApiService.logout();
            setAuthStatus({
                isAuthenticated: false,
                isAdmin: false,
                isUser: false
            });
            navigate('/home');
        }
    };

    // Add console logs for debugging
    console.log("Auth Status:", authStatus);
    console.log("Token:", localStorage.getItem('token'));
    console.log("Role:", localStorage.getItem('role'));

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home">CheckInCloud</NavLink>
            </div>
            <ul className="navbar-ul">
                <li>
                    <NavLink to="/home">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/rooms">Rooms</NavLink>
                </li>
                <li>
                    <NavLink to="/find-bookings">Find My Bookings</NavLink>
                </li>

                
                
                {authStatus.isAdmin && (
                    <li>
                        <NavLink to="/admin">Admin</NavLink>
                    </li>
                )}
                
                {!authStatus.isAuthenticated && (
                    <>
                        <li>
                            <NavLink to="/login">Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="/register">Register</NavLink>
                        </li>
                    </>
                )}
                
                {authStatus.isAuthenticated && (
                    <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        Logout
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;