package com.neobank360app.dto;

import java.time.LocalDateTime;
import java.util.Set;

/**
 * Returned by:
 *   GET /api/v1/users/me     (UserController)
 *   GET /api/v1/auth/me      (AuthController)
 *
 * Contains everything the frontend needs to render the profile page
 * after admin approves account status and KYC.
 *
 * NEVER includes: passwordHash
 */
public class MeResponse {

    private Long userId;
    private String customerId;
    private String fullName;
    private String email;
    private String phone;

    /** ACTIVE | INACTIVE | LOCKED */
    private String status;

    /** PENDING | ACCEPTED | REJECTED */
    private String kycStatus;

    /** e.g. ["ROLE_CUSTOMER"] */
    private Set<String> roles;

    /** Account registration timestamp — shown as "Member since" on dashboard */
    private LocalDateTime createdAt;

    public MeResponse() {}

    public Long getUserId()                           { return userId; }
    public void setUserId(Long userId)                { this.userId = userId; }

    public String getCustomerId()                     { return customerId; }
    public void setCustomerId(String customerId)      { this.customerId = customerId; }

    public String getFullName()                       { return fullName; }
    public void setFullName(String fullName)          { this.fullName = fullName; }

    public String getEmail()                          { return email; }
    public void setEmail(String email)                { this.email = email; }

    public String getPhone()                          { return phone; }
    public void setPhone(String phone)                { this.phone = phone; }

    public String getStatus()                         { return status; }
    public void setStatus(String status)              { this.status = status; }

    public String getKycStatus()                      { return kycStatus; }
    public void setKycStatus(String kycStatus)        { this.kycStatus = kycStatus; }

    public Set<String> getRoles()                     { return roles; }
    public void setRoles(Set<String> roles)           { this.roles = roles; }

    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}