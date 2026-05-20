package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.config.JwtTokenProvider;
import com.dotnt.server.dto.request.LoginRequest;
import com.dotnt.server.dto.request.RegisterRequest;
import com.dotnt.server.dto.request.UpdatePasswordRequest;
import com.dotnt.server.dto.request.UpdateProfileRequest;
import com.dotnt.server.dto.response.LoginResponse;
import com.dotnt.server.dto.response.UserResponse;
import com.dotnt.server.entity.CustomUserDetails;
import com.dotnt.server.entity.User;
import com.dotnt.server.service.UserService;
import com.dotnt.server.service.impl.CustomUserDetailsServiceImpl;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RestResponse
@RequestMapping("/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public LoginResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return null;
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userService.findByUsernameOrEmail(userDetails.getUsername());

        return LoginResponse.builder()
                .token(null)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(userDetails.getRole())
                .build();
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public LoginResponse registerUser(
            @RequestBody RegisterRequest registerRequest) {
        // 1. Thêm user mới
        User newUser = userService.register(registerRequest);

        // Chuyển User thành CustomUserDetails
        CustomUserDetails userDetails = new CustomUserDetails(newUser);

        // 2. Tự động authenticate user mới
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getUsername(),
                        registerRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 3. Tạo token JWT
        String token = jwtTokenProvider.generateToken(authentication);

        // 4. Trả về token và thông tin user
        return  LoginResponse.builder()
                .token(token)
                .userId(newUser.getId())
                .email(newUser.getEmail())
                .username(newUser.getUsername())
                .role(userDetails.getRole())
                .build();
    }

    // 🆕 Cập nhật hồ sơ
    @PutMapping("/profile")
    @ResponseStatus(HttpStatus.OK)
    public UserResponse updateProfile(@RequestBody UpdateProfileRequest request) {
        Long currentUserId = getCurrentUserId();
        return userService.updateProfile(currentUserId, request);
    }

    @PutMapping("/password")
    @ResponseStatus(HttpStatus.OK)
    public void updatePassword(@RequestBody UpdatePasswordRequest request) {
        Long currentUserId = getCurrentUserId();
        userService.updatePassword(currentUserId, request);
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            throw new RuntimeException("Unauthorized");
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }
}
