
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FooterComponent from './components/common/Footer';
import Navbar from './components/common/Navbar';
import HomePage from './components/home/HomePage';
import AllRoomsPage from './components/bookings_rooms/AllRoomsPage';
import FindBookingPage from './components/bookings_rooms/FindBookingPage';
import RoomDetailsPage from './components/bookings_rooms/RoomDetailsPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProfilePage from './components/profile/ProfilePage';
import EditProfilePage from './components/profile/EditProfilePage';
import { ProtectedRoute , AdminRoute } from './service/guard';
import AdminPage from './components/admin/AdminPage';
import ManageRoomPage from './components/admin/ManageRoomPage';
import EditRoomPage from './components/admin/EditRoomPage';
import AddRoomPage from './components/admin/AddRoomPage';
import ManageBookingsPage from './components/admin/ManageBookingsPage';
import EditBookingPage from './components/admin/EditBookingPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className='content'>
          <Routes>

            <Route exact path='/home' element={<HomePage />} />
            <Route exact path='/rooms' element={<AllRoomsPage />} />
            <Route exact path='/find-bookings' element={<FindBookingPage />} />
            <Route exact path='/login' element={<LoginPage />} />
            <Route exact path='/register' element={<RegisterPage />} />

            {/* authenticated users routes */}
            <Route exact path='/profile' element={<ProtectedRoute element = {<ProfilePage />} />} />
            <Route exact path='/edit-profile' element={<ProtectedRoute element = {<EditProfilePage />} />} />
            <Route exact path='/room-details-book/:roomId' element={<ProtectedRoute element = {<RoomDetailsPage />} />} />
            
            
            
            <Route exact path='*' element={<Navigate to="/home"/>} />

            <Route path="/admin"
              element={<AdminRoute element={<AdminPage />} />}
            />
            <Route path="/admin/manage-rooms"
              element={<AdminRoute element={<ManageRoomPage />} />}
            />
            <Route path="/admin/edit-room/:roomId"
              element={<AdminRoute element={<EditRoomPage />} />}
            />
            <Route path="/admin/add-room"
              element={<AdminRoute element={<AddRoomPage />} />}
            />
            <Route path="/admin/manage-bookings"
              element={<AdminRoute element={<ManageBookingsPage />} />}
            />
            <Route path="/admin/edit-booking/:bookingCode"
              element={<AdminRoute element={<EditBookingPage />} />}
            />



          </Routes>
        </div>


        
      </div>
    </BrowserRouter>
  );
}

export default App;
