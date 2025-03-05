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
    private String roomPhotoUrl;
    private String roomDescription;
    @OneToMany(mappedBy = "room" , fetch= FetchType.LAZY , cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", bookingConfirmationCode='" + bookingConfirmationCode + '\'' +
                ", roomType='" + roomType + '\'' +
                ", roomPrice=" + roomPrice +
                ", roomPhotoUrl='" + roomPhotoUrl + '\'' +
                ", roomDescription='" + roomDescription + '\'' +
                ", bookings=" + bookings +
                '}';
    }
}
