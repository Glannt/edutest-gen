package com.dotnt.server.service;

import com.dotnt.server.dto.UserDto;
import com.dotnt.server.dto.request.RegisterRequest;
import com.dotnt.server.dto.response.UserResponse;
import com.dotnt.server.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponse save(UserDto user);
    UserResponse findById(Long id);
    Page<UserResponse> findAll(Pageable pageable);
    void deleteById(Long id);
    UserResponse update(Long id, UserDto user);
    User findByUsernameOrEmail(String username);
    User register(RegisterRequest request);
}