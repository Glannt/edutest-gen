package com.dotnt.server.service;

import com.dotnt.server.dto.request.RegisterRequest;
import com.dotnt.server.entity.User;

import java.util.List;

public interface UserService {
    User save(User user);
    User findById(Long id);
    List<User> findAll();
    void deleteById(Long id);
    User update(User user);
    User findByUsername(String username);
    User register(RegisterRequest request);
}