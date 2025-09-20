//package com.dotnt.server.controller;
//
//import com.dotnt.server.dto.request.LoginRequest;
//import com.dotnt.server.dto.request.RegisterRequest;
//import com.dotnt.server.dto.response.ApiResponse;
//import com.dotnt.server.dto.response.JwtResponse;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.validation.Valid;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/auth")
//@Tag(name = "Authentication", description = "APIs for user authentication")
//@Slf4j
//public class AuthController extends BaseController {
//
//    private final AuthService authService;
//
//    public AuthController(AuthService authService) {
//        this.authService = authService;
//    }
//
//    @PostMapping("/login")
//    @Operation(summary = "User login")
//    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
//        log.debug("REST request to authenticate user: {}", loginRequest.getUsername());
//
//        try {
//            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
//            return success("Login successful", jwtResponse);
//        } catch (Exception e) {
//            log.error("Authentication failed for user: {}", loginRequest.getUsername(), e);
//            return error("Invalid username or password");
//        }
//    }
//
//    @PostMapping("/register")
//    @Operation(summary = "User registration")
//    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest registerRequest) {
//        log.debug("REST request to register user: {}", registerRequest.getUsername());
//
//        try {
//            authService.registerUser(registerRequest);
//            return success("User registered successfully", "Please login to continue");
//        } catch (Exception e) {
//            log.error("Registration failed for user: {}", registerRequest.getUsername(), e);
//            return error(e.getMessage());
//        }
//    }
//
//    @PostMapping("/refresh")
//    @Operation(summary = "Refresh JWT token")
//    public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(@RequestParam String refreshToken) {
//        log.debug("REST request to refresh token");
//
//        try {
//            JwtResponse jwtResponse = authService.refreshToken(refreshToken);
//            return success("Token refreshed successfully", jwtResponse);
//        } catch (Exception e) {
//            log.error("Token refresh failed", e);
//            return error("Invalid refresh token");
//        }
//    }
//}