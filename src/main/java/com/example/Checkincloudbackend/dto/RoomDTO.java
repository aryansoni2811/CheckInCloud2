package com.example.Checkincloudbackend.dto;

import com.example.Checkincloudbackend.entity.Booking;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomDTO {
    private Long id;

    private String roomType;
    private BigDecimal roomPrice;
    private byte[] roomPhoto;
    //private String roomPhotoUrl;
    private String roomDescription;
    private List<BookingDTO> bookings = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public BigDecimal getRoomPrice() {
        return roomPrice;
    }

    public void setRoomPrice(BigDecimal roomPrice) {
        this.roomPrice = roomPrice;
    }

    public byte[] getRoomPhoto() {
        return roomPhoto;
    }

    public void setRoomPhoto(byte[] roomPhoto) {
        this.roomPhoto = roomPhoto;
    }
//    public String getRoomPhotoUrl() {
//        return roomPhotoUrl;
//    }
//
//    public void setRoomPhotoUrl(String roomPhotoUrl) {
//        this.roomPhotoUrl = roomPhotoUrl;
//    }

    public String getRoomDescription() {
        return roomDescription;
    }

    public void setRoomDescription(String roomDescription) {
        this.roomDescription = roomDescription;
    }

    public List<BookingDTO> getBookings() {
        return bookings;
    }

    public void setBookings(List<BookingDTO> bookings) {
        this.bookings = bookings;
    }
}
