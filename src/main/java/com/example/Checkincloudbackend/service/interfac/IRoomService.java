package com.example.Checkincloudbackend.service.interfac;

import com.example.Checkincloudbackend.dto.Response;
import com.example.Checkincloudbackend.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IRoomService {
    Response addNewRoom(byte[] photo, String roomType, BigDecimal roomPrice, String description);

    Response getAllRooms();

    List<String> getAllRoomTypes();

    Response deleteRoom(Long roomId);

    Response updateRoom(Long roomId, String description, String roomType, BigDecimal roomPrice, byte[] photo);

    Response getRoomById(Long roomId);

    Response getAvailableRoomsByDateAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType);

    Response getAllAvailableRooms();
}