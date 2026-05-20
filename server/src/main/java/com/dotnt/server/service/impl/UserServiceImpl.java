package com.dotnt.server.service.impl;

import com.dotnt.server.config.JwtTokenProvider;
import com.dotnt.server.dto.UserDto;
import com.dotnt.server.dto.request.LoginRequest;
import com.dotnt.server.dto.request.RegisterRequest;
import com.dotnt.server.dto.request.UpdatePasswordRequest;
import com.dotnt.server.dto.request.UpdateProfileRequest;
import com.dotnt.server.dto.response.LoginResponse;
import com.dotnt.server.dto.response.UserResponse;
import com.dotnt.server.entity.CustomUserDetails;
import com.dotnt.server.entity.User;
import com.dotnt.server.repository.UserRepository;
import com.dotnt.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

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
        userRepository.save(user);
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

    @Override
    public LoginResponse login(LoginRequest loginRequest) {

        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Generate JWT
        String token = jwtTokenProvider.generateToken(authentication);

        // Get user info
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = findByUsernameOrEmail(userDetails.getUsername());

        // Update last login
        user.setLastLogin(new Date());
        userRepository.save(user);

        // Build response
        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().toString())
                .build();
    }

    @Override
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.getFullName().equals(request.getFullName())) {
            user.setFullName(request.getFullName());
        }
        user.setUpdatedAt(LocalDateTime.now());

        User updated = userRepository.save(user);

        return UserResponse.builder()
                .id(updated.getId())
                .username(updated.getUsername())
                .email(updated.getEmail())
                .fullName(updated.getFullName())
                .role(updated.getRole())
                .isActive(updated.isActive())
                .createdAt(updated.getCreatedAt())
                .updatedAt(updated.getUpdatedAt())
                .build();
    }

    @Override
    public void updatePassword(Long userId, UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Mật khẩu hiện tại không đúng");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
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
