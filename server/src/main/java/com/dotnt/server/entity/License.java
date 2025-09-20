//package com.dotnt.server.entity;
//
//import com.dotnt.server.enums.LicenseStatus;
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//import lombok.*;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "licenses")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//@EqualsAndHashCode(callSuper = true)
//public class License extends BaseEntity {
//    @NotBlank(message = "License key is required")
//    @Column(name = "license_key", nullable = false, unique = true)
//    private String licenseKey;
//
//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id")
//    private User user;
//
//    @Column(name = "activated_at")
//    private LocalDateTime activatedAt;
//
//    @Column(name = "expiry_date")
//    private LocalDateTime expiryDate;
//
//    @Column(name = "max_usages", nullable = false)
//    private Integer maxUsages = 1000;
//
//    @Column(name = "current_usage")
//    private Integer currentUsage = 0;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "status", nullable = false)
//    private LicenseStatus status = LicenseStatus.INACTIVE;
//}