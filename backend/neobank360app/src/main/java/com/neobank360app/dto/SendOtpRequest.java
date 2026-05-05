package com.neobank360app.dto;

import jakarta.validation.constraints.NotBlank;

public class SendOtpRequest {

    @NotBlank(message = "Reference is required")
    private String reference;  // phone / email / aadhaar

    @NotBlank(message = "OTP type is required")
    private String otpType;    // MOBILE_OTP / EMAIL_OTP / AADHAAR_OTP

    public SendOtpRequest() {}
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getOtpType() { return otpType; }
    public void setOtpType(String otpType) { this.otpType = otpType; }
}