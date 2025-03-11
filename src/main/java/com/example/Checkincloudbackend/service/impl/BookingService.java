package com.example.Checkincloudbackend.service.impl;

import com.example.Checkincloudbackend.dto.BookingDTO;
import com.example.Checkincloudbackend.dto.Response;
import com.example.Checkincloudbackend.entity.Booking;
import com.example.Checkincloudbackend.entity.Room;
import com.example.Checkincloudbackend.entity.User;
import com.example.Checkincloudbackend.exception.OurException;
import com.example.Checkincloudbackend.repository.BookingRepository;
import com.example.Checkincloudbackend.repository.RoomRepository;
import com.example.Checkincloudbackend.repository.UserRepository;
import com.example.Checkincloudbackend.service.interfac.IBookingService;
import com.example.Checkincloudbackend.service.interfac.IRoomService;
import com.example.Checkincloudbackend.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class BookingService implements IBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private IRoomService roomService;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Response saveBooking(Long roomId, Long userId, Booking bookingRequest) {

        Response response = new Response();

        try{
            if(bookingRequest.getCheckOutDate().isBefore(bookingRequest.getCheckInDate())){
                throw new IllegalArgumentException("check in date must be after check after date");


            }

            Room room = roomRepository.findById(roomId).orElseThrow(()-> new OurException("room not found"));
            User user = userRepository.findById(userId).orElseThrow(()-> new OurException("user not found"));

            List<Booking> existingBooking = room.getBookings();

            if(!roomisAvailable(bookingRequest , existingBooking)){
                throw  new OurException("room not available for selectedd dates");
            }

            bookingRequest.setRoom(room);
            bookingRequest.setUser(user);
            String bookingConfirmationCode = Utils.generateRandomConfirmationCode(10);
            bookingRequest.setBookingConfirmationCode(bookingConfirmationCode);
            bookingRepository.save(bookingRequest);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setBookingConfirmationCode(bookingConfirmationCode);

        }catch (OurException e){

            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage("error saving the booking" +e.getMessage());
        }
        return response;
    }

    private boolean roomisAvailable(Booking bookingRequest, List<Booking> existingBooking) {
        return existingBooking.stream()
                .noneMatch(booking ->
                        bookingRequest.getCheckInDate().equals(booking.getCheckInDate())
                                || bookingRequest.getCheckOutDate().isBefore(booking.getCheckOutDate())
                                || (bookingRequest.getCheckInDate().isAfter(booking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(booking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(booking.getCheckInDate())
                                && bookingRequest.getCheckOutDate().equals(booking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().isBefore(booking.getCheckInDate())
                                && bookingRequest.getCheckOutDate().isAfter(booking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate().equals(booking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(booking.getCheckInDate()))
                                || (bookingRequest.getCheckInDate().equals(booking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(bookingRequest.getCheckInDate()))
                );
    }


    @Override
    public Response findBookingByConfirmationCode(String confirmationCode) {
        Response response = new Response();

        try{
            Booking booking = bookingRepository.findByBookingConfirmationCode(confirmationCode).orElseThrow(()-> new OurException("booking not found"));
            BookingDTO bookingDto= Utils.mapBookingEntityToBookingDTOPlusBookedRoom(booking , true);


            response.setStatusCode(200);
            response.setMessage("successful");
            response.setBooking(bookingDto);

        }catch (OurException e){

            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage("error finding the booking" +e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllBookings() {
        Response response = new Response();

        try{
            List<Booking> bookingList = bookingRepository.findAll(Sort.by(Sort.Direction.DESC , "id"));

            List<BookingDTO> bookingDTOList= Utils.mapBookingListEntityToBookingListDTO(bookingList);



            response.setStatusCode(200);
            response.setMessage("successful");
            response.setBookingList(bookingDTOList);

        }catch (OurException e){

            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage("error getting all the booking" +e.getMessage());
        }
        return response;
    }

    @Override
    public Response cancelBooking(Long bookingId) {
        Response response = new Response();

        try{
            bookingRepository.findById(bookingId).orElseThrow(()-> new OurException("Booking does not exist"));


            bookingRepository.deleteById(bookingId);



            response.setStatusCode(200);
            response.setMessage("successful");


        }catch (OurException e){

            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage("error cancelling the booking" +e.getMessage());
        }
        return response;
    }
}
