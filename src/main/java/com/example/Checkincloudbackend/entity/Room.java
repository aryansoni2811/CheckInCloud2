package com.example.Checkincloudbackend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.awt.print.Book;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name ="rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private long id;


    private String bookingConfirmationCode;
    private String roomType;
    private BigDecimal roomPrice;

    @Lob
    private byte[] roomPhoto;

    //private String roomPhotoUrl;
    private String roomDescription;
    @OneToMany(mappedBy = "room" , fetch= FetchType.LAZY , cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

    public byte[] getRoomPhoto() {
        return roomPhoto;
    }

    public void setRoomPhoto(byte[] roomPhoto) {
        this.roomPhoto = roomPhoto;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getBookingConfirmationCode() {
        return bookingConfirmationCode;
    }

    public void setBookingConfirmationCode(String bookingConfirmationCode) {
        this.bookingConfirmationCode = bookingConfirmationCode;
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



    public String getRoomDescription() {
        return roomDescription;
    }

    public void setRoomDescription(String roomDescription) {
        this.roomDescription = roomDescription;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", bookingConfirmationCode='" + bookingConfirmationCode + '\'' +
                ", roomType='" + roomType + '\'' +
                ", roomPrice=" + roomPrice +
                ", roomPhotoUrl='" + roomPhoto+ '\'' +
                ", roomDescription='" + roomDescription + '\'' +
                ", bookings=" + bookings +
                '}';
    }
}
