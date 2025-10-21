package com.dotnt.server.service.impl;

import com.dotnt.server.dto.UserDto;
import com.dotnt.server.dto.request.RegisterRequest;
import com.dotnt.server.dto.response.UserResponse;
import com.dotnt.server.entity.User;
import com.dotnt.server.repository.UserRepository;
import com.dotnt.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse save(UserDto user) {
        return this.toResponse(userRepository.save(User.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .role(user.getRole())
                .fullName(user.getFullName())
                .isActive(user.getIsActive())
                .password(passwordEncoder.encode(user.getPassword()))
                .build()));
    }

    @Override
    public UserResponse findById(Long id) {
        return this.toResponse(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    @Override
    public Page<UserResponse> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void deleteById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
    }

    @Override
    public UserResponse update(Long id, UserDto user) {
        User existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if(!existingUser.getFullName().equals(user.getFullName())) {
            existingUser.setFullName(user.getFullName());
        }
        if(!existingUser.getRole().equals(user.getRole())) {
            existingUser.setRole(user.getRole());
        }
        if(!existingUser.isActive() == user.getIsActive()){
            existingUser.setActive(user.getIsActive());
        }
        return this.toResponse(userRepository.save(existingUser));
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

    private UserResponse toResponse(User entity) {
        if (entity == null) return null;

        return UserResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .role(entity.getRole())
                .isActive(entity.isActive())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }


}
