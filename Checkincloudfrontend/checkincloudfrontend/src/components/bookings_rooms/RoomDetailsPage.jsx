import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import defualtimage from '../assets/hotel.png'

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch room details
        const roomResponse = await ApiService.getRoomById(roomId);
        console.log("Room response:", roomResponse);
        if (roomResponse && roomResponse.room) {
          setRoomDetails(roomResponse.room);
          
          // Handle blob image
          if (roomResponse.room.roomPhoto) {
            // Check if the roomPhoto is already a URL string
            if (typeof roomResponse.room.roomPhoto === 'string') {
              setImageUrl(roomResponse.room.roomPhoto);
            } 
            // If it's a blob
            else if (roomResponse.room.roomPhoto instanceof Blob) {
              const imageUrl = URL.createObjectURL(roomResponse.room.roomPhoto);
              setImageUrl(imageUrl);
            } 
            // If it's a base64 string or byte array
            else if (typeof roomResponse.room.roomPhoto === 'object' && roomResponse.room.roomPhoto.data) {
              // Convert byte array to base64
              const bytes = new Uint8Array(roomResponse.room.roomPhoto.data);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64 = window.btoa(binary);
              setImageUrl(`data:image/jpeg;base64,${base64}`);
            }
          }
        } else {
          throw new Error("Invalid room data received");
        }
        
        // Get user ID from localStorage
        const userIdFromStorage = localStorage.getItem('userId');
        if (userIdFromStorage) {
          console.log("User ID from localStorage:", userIdFromStorage);
          setUserId(parseInt(userIdFromStorage)); // Ensure it's a number
        } else {
          console.error("User ID not found in localStorage");
          setErrorMessage("Please login to continue.");
        }
        
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup function to revoke object URLs
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [roomId]);

  const handleConfirmBooking = async () => {
    // Check if user is logged in
    if (!userId) {
      setErrorMessage('Please log in to book a room.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    // Check if check-in and check-out dates are selected
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please select check-in and check-out dates.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    // Check if number of adults and children are valid
    if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
      setErrorMessage('Please enter valid numbers for adults and children.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    // Calculate total number of days
    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

    // Calculate total number of guests
    const totalGuests = numAdults + numChildren;

    // Calculate total price
    const roomPricePerNight = roomDetails.roomPrice;
    const totalPrice = roomPricePerNight * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
  };

  const acceptBooking = async () => {
    // Check if user is logged in
    if (!userId) {
      setErrorMessage('Please log in to book a room.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }
    
    try {
      // Ensure checkInDate and checkOutDate are Date objects
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      // Log the original dates for debugging
      console.log("Original Check-in Date:", startDate);
      console.log("Original Check-out Date:", endDate);

      // Convert dates to YYYY-MM-DD format, adjusting for time zone differences
      const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      // Log the formatted dates for debugging
      console.log("Formatted Check-in Date:", formattedCheckInDate);
      console.log("Formatted Check-out Date:", formattedCheckOutDate);

      // Create booking object
      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren
      };
      console.log("Booking data:", booking);
      console.log("User ID:", userId);
      console.log("Room ID:", roomId);

      // Make booking
      const response = await ApiService.bookRoom(roomId, userId, booking);
      console.log("Booking response:", response);
      
      if (response && response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        // Hide message and navigate to homepage after 10 seconds
        setTimeout(() => {
          setShowMessage(false);
          navigate('/rooms');
        }, 10000);
      } else {
        throw new Error("Booking failed with unexpected response");
      }
    } catch (error) {
      console.error("Error making booking:", error);
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  if (isLoading) {
    return <p className='room-detail-loading'>Loading room details...</p>;
  }

  if (error) {
    return <p className='room-detail-loading'>{error}</p>;
  }

  if (!roomDetails) {
    return <p className='room-detail-loading'>Room not found.</p>;
  }

  const { roomType, roomPrice, description, bookings } = roomDetails;

  return (
    <div className="room-details-booking">
      {showMessage && (
        <p className="booking-success-message">
          Booking successful! Confirmation code: {confirmationCode}. An SMS and email of your booking details have been sent to you.
        </p>
      )}
      {errorMessage && (
        <p className="error-message">
          {errorMessage}
        </p>
      )}
      <h2>Room Details</h2>
      <br />
       
        <img src={defualtimage} alt={roomType} className="room-details-image" />
       
      <div className="room-details-info">
        <h3>{roomType}</h3>
        <p>Price: ${roomPrice} / night</p>
        <p>{description}</p>
      </div>
      {bookings && bookings.length > 0 && (
        <div>
          <h3>Existing Booking Details</h3>
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <li key={booking.id || index} className="booking-item">
                <span className="booking-number">Booking {index + 1} </span>
                <span className="booking-text">Check-in: {booking.checkInDate} </span>
                <span className="booking-text">Out: {booking.checkOutDate}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="booking-info">
        <button className="book-now-button" onClick={() => setShowDatePicker(true)}>Book Now</button>
        <button className="go-back-button" onClick={() => setShowDatePicker(false)}>Go Back</button>
        {showDatePicker && (
          <div className="date-picker-container">
            <DatePicker
              className="detail-search-field"
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              placeholderText="Check-in Date"
              dateFormat="dd/MM/yyyy"
            />
            <DatePicker
              className="detail-search-field"
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate}
              placeholderText="Check-out Date"
              dateFormat="dd/MM/yyyy"
            />

            <div className='guest-container'>
              <div className="guest-div">
                <label>Adults:</label>
                <input
                  type="number"
                  min="1"
                  value={numAdults}
                  onChange={(e) => setNumAdults(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="guest-div">
                <label>Children:</label>
                <input
                  type="number"
                  min="0"
                  value={numChildren}
                  onChange={(e) => setNumChildren(parseInt(e.target.value) || 0)}
                />
              </div>
              <button className="confirm-booking" onClick={handleConfirmBooking}>Confirm Booking</button>
            </div>
          </div>
        )}
        {totalPrice > 0 && (
          <div className="total-price">
            <p>Total Price: ${totalPrice}</p>
            <p>Total Guests: {totalGuests}</p>
            <button onClick={acceptBooking} className="accept-booking">Accept Booking</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;