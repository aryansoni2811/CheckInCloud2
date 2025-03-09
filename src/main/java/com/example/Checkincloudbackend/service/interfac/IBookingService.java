package com.example.Checkincloudbackend.service.interfac;

import com.example.Checkincloudbackend.dto.Response;
import com.example.Checkincloudbackend.entity.Booking;

public interface IBookingService {

    Response saveBooking(Long roomId , Long userId , Booking bookingRequest);

    Response findBookingByConfirmationCode(String confirmationCode);

    Response getAllBookings();

    Response cancelBooking(Long bookingId);



}
