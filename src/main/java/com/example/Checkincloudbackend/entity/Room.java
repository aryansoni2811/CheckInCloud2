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
    private List<Booking> bookings = new ArrayList<>();

}
