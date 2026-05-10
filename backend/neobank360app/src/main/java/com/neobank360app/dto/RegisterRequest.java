//package com.neobank360app.dto;
//
//import jakarta.validation.constraints.*;
//
//public class RegisterRequest {
//
//    @NotBlank(message = "Full name is required")
//    private String fullName;
//
//    @NotBlank(message = "Email is required")
//    @Email(message = "Invalid email format")
//    private String email;
//
//    @NotBlank(message = "Phone is required")
//    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid Indian mobile number")
//    private String phone;
//
//    @NotBlank(message = "Password is required")
//    @Size(min = 8, message = "Password must be at least 8 characters")
//    private String password;
//
//    @NotBlank(message = "Confirm password is required")
//    private String confirmPassword;
//
//    @NotBlank(message = "Branch selection is required")
//    private String branchCode;
//
//    @NotBlank(message = "Account type is required")
//    @Pattern(regexp = "SAVINGS|CURRENT|SALARY",
//             message = "Account type must be SAVINGS, CURRENT, or SALARY")
//    private String accountType;
//
//    @NotBlank(message = "Aadhaar number is required")
//    @Pattern(regexp = "\\d{12}", message = "Aadhaar must be exactly 12 digits")
//    private String aadhaarNumber;
//
//    @NotBlank(message = "PAN number is required")
//    @Pattern(regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}", message = "Invalid PAN (e.g. ABCDE1234F)")
//    private String panNumber;
//
//    // References used to verify OTPs were completed before registration
//    @NotBlank(message = "Email OTP reference is required")
//    private String emailOtpReference;
//
//    @NotBlank(message = "Mobile OTP reference is required")
//    private String mobileOtpReference;
//
//    public String getFullName() { return fullName; }
//    public void setFullName(String fullName) { this.fullName = fullName; }
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//    public String getPhone() { return phone; }
//    public void setPhone(String phone) { this.phone = phone; }
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//    public String getConfirmPassword() { return confirmPassword; }
//    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
//    public String getBranchCode() { return branchCode; }
//    public void setBranchCode(String branchCode) { this.branchCode = branchCode; }
//    public String getAccountType() { return accountType; }
//    public void setAccountType(String accountType) { this.accountType = accountType; }
//    public String getAadhaarNumber() { return aadhaarNumber; }
//    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }
//    public String getPanNumber() { return panNumber; }
//    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }
//    public String getEmailOtpReference() { return emailOtpReference; }
//    public void setEmailOtpReference(String e) { this.emailOtpReference = e; }
//    public String getMobileOtpReference() { return mobileOtpReference; }
//    public void setMobileOtpReference(String m) { this.mobileOtpReference = m; }
//}

package com.neobank360app.dto;

import com.neobank360app.entity.AccountType;
import jakarta.validation.constraints.*;

public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(
            regexp = "^[6-9]\\d{9}$",
            message = "Invalid Indian mobile number"
    )
    private String phone;

    @NotBlank(message = "Password is required")
    @Size(
            min = 8,
            message = "Password must be at least 8 characters"
    )
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    @NotBlank(message = "Branch selection is required")
    private String branchCode;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @NotBlank(message = "Aadhaar number is required")
    @Pattern(
            regexp = "\\d{12}",
            message = "Aadhaar must be exactly 12 digits"
    )
    private String aadhaarNumber;

    @NotBlank(message = "PAN number is required")
    @Pattern(
            regexp = "[A-Z]{5}[0-9]{4}[A-Z]{1}",
            message = "Invalid PAN (e.g. ABCDE1234F)"
    )
    private String panNumber;

    @NotBlank(message = "Email OTP reference is required")
    private String emailOtpReference;

    @NotBlank(message = "Mobile OTP reference is required")
    private String mobileOtpReference;

    public RegisterRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public String getEmailOtpReference() {
        return emailOtpReference;
    }

    public void setEmailOtpReference(String emailOtpReference) {
        this.emailOtpReference = emailOtpReference;
    }

    public String getMobileOtpReference() {
        return mobileOtpReference;
    }

    public void setMobileOtpReference(String mobileOtpReference) {
        this.mobileOtpReference = mobileOtpReference;
    }
}