package com.dotnt.server.controller;

import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.config.JwtTokenProvider;
import com.dotnt.server.dto.request.LoginRequest;
import com.dotnt.server.dto.request.RegisterRequest;
import com.dotnt.server.dto.response.LoginResponse;
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

        return LoginResponse.builder()
                .token(token)
                .username(userDetails.getUsername())
                .role(userDetails.getRole())
                .build();
    }

    // GET /api/auth/me
    @GetMapping("/me")
    public LoginResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return null;
        }
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return LoginResponse.builder()
                .token(null)
                .username(userDetails.getUsername())
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
                .username(userDetails.getUsername())
                .role(userDetails.getRole())
                .build();
    }
}
