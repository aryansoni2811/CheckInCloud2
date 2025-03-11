
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FooterComponent from './components/common/Footer';
import Navbar from './components/common/Navbar';
import HomePage from './components/home/HomePage';
import AllRoomsPage from './components/bookings_rooms/AllRoomsPage';
import FindBookingPage from './components/bookings_rooms/FindBookingPage';

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
          </Routes>
        </div>


        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;
