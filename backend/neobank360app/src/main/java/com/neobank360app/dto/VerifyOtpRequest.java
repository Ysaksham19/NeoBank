package com.neobank360app.dto;

import jakarta.validation.constraints.NotBlank;

public class VerifyOtpRequest {

    @NotBlank(message = "Reference is required")
    private String reference;

    @NotBlank(message = "OTP type is required")
    private String otpType;

    @NotBlank(message = "OTP code is required")
    private String otpCode;

    public VerifyOtpRequest() {}
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getOtpType() { return otpType; }
    public void setOtpType(String otpType) { this.otpType = otpType; }
    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
}