package com.dotnt.server.dto;

import com.dotnt.server.enums.UserRole;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Builder
public class UserDto extends BaseDto {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    private String fullName;

    @Builder.Default
    private UserRole role = UserRole.TEACHER;

    @Builder.Default
    private Boolean isActive = true;

//    private LicenseDto license;
}
