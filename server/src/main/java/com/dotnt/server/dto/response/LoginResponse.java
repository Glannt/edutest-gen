package com.dotnt.server.dto.response;

import com.dotnt.server.enums.UserRole;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private Long userId;
    private String username;
    private String email;
    private String role;
}
