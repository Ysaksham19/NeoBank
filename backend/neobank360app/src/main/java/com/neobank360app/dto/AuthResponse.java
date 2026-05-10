//package com.neobank360app.dto;
//
//import java.util.Set;
//
//import com.neobank360app.entity.AccountType;
//
//public class AuthResponse {
//
//    private String accessToken;
//    private String tokenType = "Bearer";
//    private Long userId;
//    private String fullName;
//    private String email;
//    private String customerId;
//    private Set<String> roles;
//
//    private String accountNo;
//    private AccountType accountType;
//    
//    private String branchName;
//    private String branchCode;
//    private String ifscCode;
//
//    public AuthResponse() {}
//
//    public AuthResponse(String accessToken, Long userId, String fullName,
//                        String email, String customerId, Set<String> roles) {
//        this.accessToken = accessToken;
//        this.userId = userId;
//        this.fullName = fullName;
//        this.email = email;
//        this.customerId = customerId;  // ✅ fixed — was self-assigning before
//        this.roles = roles;
//    }
//
//    public String getAccessToken() { return accessToken; }
//    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
//
//    public String getTokenType() { return tokenType; }
//
//    public Long getUserId() { return userId; }
//    public void setUserId(Long userId) { this.userId = userId; }
//
//    public String getFullName() { return fullName; }
//    public void setFullName(String fullName) { this.fullName = fullName; }
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//
//    public String getCustomerId() { return customerId; }           // ✅ clean name
//    public void setCustomerId(String customerId) { this.customerId = customerId; }
//
//    public Set<String> getRoles() { return roles; }
//    public void setRoles(Set<String> roles) { this.roles = roles; }
//
//    public String getAccountNo() { return accountNo; }
//    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
//
//    public AccountType getAccountType() {return accountType; }   
//    public void setAccountType(AccountType accountType) { this.accountType = accountType; }
//
//    public String getBranchName() { return branchName; }
//    public void setBranchName(String branchName) { this.branchName = branchName; }
//
//    public String getBranchCode() { return branchCode; }
//    public void setBranchCode(String branchCode) { this.branchCode = branchCode; }
//
//    public String getIfscCode() { return ifscCode; }
//    public void setIfscCode(String ifscCode) { this.ifscCode = ifscCode; }
//}



package com.neobank360app.dto;

import com.neobank360app.entity.AccountType;

import java.util.Set;

public class AuthResponse {

    private String accessToken;

    private String tokenType = "Bearer";

    private Long userId;

    private String fullName;

    private String email;

    private String customerId;

    private Set<String> roles;

    private String accountNo;

    private AccountType accountType;

    private String branchName;

    private String branchCode;

    private String ifscCode;

    public AuthResponse() {
    }

    public AuthResponse(
            String accessToken,
            Long userId,
            String fullName,
            String email,
            String customerId,
            Set<String> roles
    ) {

        this.accessToken = accessToken;
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.customerId = customerId;
        this.roles = roles;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getBranchCode() {
        return branchCode;
    }

    public void setBranchCode(String branchCode) {
        this.branchCode = branchCode;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }
}