package com.dotnt.server.dto.request;

import com.dotnt.server.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @JsonProperty("full_name")
    @NotBlank(message = "Full name is required")
    private String fullName;

    @Builder.Default
    private UserRole role = UserRole.TEACHER;
}
