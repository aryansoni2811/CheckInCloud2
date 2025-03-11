import React from "react";
import {Navigate, NavLink , useLocation, useNavigate} from "react-router-dom";
import ApiService from "../../service/ApiService";


function Navbar(){
    const isAuthenticated = ApiService.isAuthenticated()
    const isAdmin = ApiService.isAdmin()
    const isUser = ApiService.isUser()
    const navigate = useNavigate();

    const handleLogout = () => {
        const isLogout= window.confirm("Are you sure you really want to logout ? ");

        if(isLogout){
            ApiService.logout();
            navigate('/home');
        }
    }


    return(
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/home">CheckInCloud</NavLink>
            </div>
            <ul className="navbar-ul">
                <li>
                    <NavLink to="/home" activeClass="active"> Home</NavLink>
                </li>
                <li>
                    <NavLink to="/rooms" activeClass="active"> Rooms</NavLink>
                </li>
                <li>
                    <NavLink to="/find-bookings" activeClass="active"> Find My Bookings</NavLink>
                </li>


                {isUser && <li>
                    <NavLink to="/profile" activeClass="active"> Profile</NavLink>
                </li>}
                {isAdmin && <li>
                    <NavLink to="/admin" activeClass="active"> Admin</NavLink>
                </li>}
                {!isAuthenticated && <li>
                    <NavLink to="/login" activeClass="active"> Login</NavLink>
                </li>}
                {!isAuthenticated && <li>
                    <NavLink to="/register" activeClass="active"> Register</NavLink>
                </li>}
                { isAuthenticated && <li onClick={handleLogout}>
                     Logout
                </li>}
            </ul>
        </nav>
    )


}

export default Navbar;