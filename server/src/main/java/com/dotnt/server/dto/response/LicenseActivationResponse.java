package com.dotnt.server.dto.response;

import com.dotnt.server.dto.LicenseDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LicenseActivationResponse {

    private boolean success;
    private String message;
    private LicenseDto license;

    public LicenseActivationResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public LicenseActivationResponse(boolean success, String message, LicenseDto license) {
        this.success = success;
        this.message = message;
        this.license = license;
    }
}
