package com.dotnt.server.dto.response;

import com.dotnt.server.dto.BaseDto;
import com.dotnt.server.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class UserResponse extends BaseDto {
    private String username;


    private String email;

    @JsonProperty("full_name")
    private String fullName;


    private UserRole role;


    private boolean isActive;
}
