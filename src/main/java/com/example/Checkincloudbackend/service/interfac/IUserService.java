package com.example.Checkincloudbackend.service.interfac;

import com.example.Checkincloudbackend.dto.LoginRequest;
import com.example.Checkincloudbackend.dto.Response;
import com.example.Checkincloudbackend.entity.User;

public interface IUserService {
    Response register(User user);

    Response login(LoginRequest loginRequest);

    Response getAllUser();

    Response getUserBookingHistory(String userId);

    Response deleteUser(String userId);

    Response getUserById(String userId);

    Response getMyInfo(String email);

}
