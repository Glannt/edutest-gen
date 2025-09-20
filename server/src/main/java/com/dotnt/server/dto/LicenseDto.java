package com.dotnt.server.dto;

import com.dotnt.server.enums.LicenseStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(callSuper = true)
public class LicenseDto extends BaseDto {

    @NotBlank(message = "License key is required")
    private String licenseKey;

    private Long userId;

    private LocalDateTime activatedAt;

    private LocalDateTime expiryDate;

    private Integer maxUsages = 1000;

    private Integer currentUsage = 0;

    private LicenseStatus status = LicenseStatus.INACTIVE;

    private String username;
    private String userEmail;
}