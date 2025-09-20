//package com.dotnt.server.entity;
//
//import com.dotnt.server.enums.UserRole;
//import jakarta.persistence.*;
//import jakarta.validation.constraints.Email;
//import jakarta.validation.constraints.NotBlank;
//import lombok.Data;
//import lombok.EqualsAndHashCode;
//
//@Entity
//@Table(name = "users")
//@Data
//@EqualsAndHashCode(callSuper = true)
//public class User extends BaseEntity {
//
//    @NotBlank(message = "Username is required")
//    @Column(name = "username", nullable = false, unique = true, length = 100)
//    private String username;
//
//    @NotBlank(message = "Password is required")
//    @Column(name = "password_hash", nullable = false)
//    private String passwordHash;
//
//    @Email(message = "Invalid email format")
//    @NotBlank(message = "Email is required")
//    @Column(name = "email", nullable = false, unique = true, length = 100)
//    private String email;
//
//    @Column(name = "full_name")
//    private String fullName;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "role", nullable = false)
//    private UserRole role = UserRole.USER;
//
//    @Column(name = "is_active")
//    private Boolean isActive = true;
//
//    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
//    private License license;
//}
