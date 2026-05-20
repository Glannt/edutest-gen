package com.dotnt.server.controller;

import com.dotnt.server.annotation.PagingResponse;
import com.dotnt.server.annotation.RestResponse;
import com.dotnt.server.dto.UserDto;
import com.dotnt.server.dto.response.UserResponse;
import com.dotnt.server.entity.User;
import com.dotnt.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@RestResponse
public class UserController {

    private final UserService userService;

    @GetMapping
    @PagingResponse
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public Page<UserResponse> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return userService.findAll(pageable);
    }

    // 🔹 Lấy chi tiết 1 người dùng
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public UserResponse getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse save(@RequestBody UserDto user) {
        return userService.save(user);
    }

    // 🔹 Cập nhật người dùng
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER')")
    public UserResponse updateUser(
            @PathVariable Long id,
            @RequestBody UserDto user
    ) {
        return userService.update(id, user);

    }

    // 🔹 Xóa người dùng
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
    }
}
