package com.dotnt.server.service.impl;

import com.dotnt.server.dto.request.RegisterRequest;
import com.dotnt.server.entity.User;
import com.dotnt.server.repository.UserRepository;
import com.dotnt.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public User update(User user) {
        if (user.getId() == null) {
            throw new RuntimeException("User ID cannot be null for update");
        }
        return userRepository.save(user);
    }

    @Override
    public User findByUsernameOrEmail(String username) {
        return userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public User register(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword())) // In real applications, ensure to hash the password
                .email(request.getEmail())
                .role(request.getRole())
                .build();
        return userRepository.save(user);
    }
}
