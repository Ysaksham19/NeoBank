package com.neobank360app.dto;

import java.util.Set;

public class MeResponse {

    private Long userId;

    private String fullName;

    private String email;

    private String phone;

    private String customerId;

    private String status;

    private String kycStatus;

    private Set<String> roles;

    public MeResponse() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(
            Long userId
    ) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(
            String fullName
    ) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(
            String email
    ) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(
            String phone
    ) {
        this.phone = phone;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(
            String customerId
    ) {
        this.customerId = customerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(
            String status
    ) {
        this.status = status;
    }

    public String getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(
            String kycStatus
    ) {
        this.kycStatus = kycStatus;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(
            Set<String> roles
    ) {
        this.roles = roles;
    }
}