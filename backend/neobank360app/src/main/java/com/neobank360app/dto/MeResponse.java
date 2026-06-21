package com.neobank360app.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class MeResponse {

    private Long userId;
    private String customerId;
    private String fullName;
    private String email;
    private String phone;
    private String status;       // ACTIVE | INACTIVE | LOCKED
    private String kycStatus;    // PENDING | ACCEPTED | REJECTED
    private Set<String> roles;
    private LocalDateTime createdAt;

    // ── NEW: banking accounts (empty for admin, filled for customer) ──
    private List<AccountSummary> accounts;

    // ── Inner class ──────────────────────────────────────────────────
    public static class AccountSummary {
        private Long id;
        private String accountNumber;
        private String accountType;    // SAVINGS | CURRENT
        private Double balance;
        private String status;         // ACTIVE | INACTIVE
        private String branchName;
        private String ifscCode;

        public AccountSummary() {}

        public Long getId()                          { return id; }
        public void setId(Long id)                   { this.id = id; }
        public String getAccountNumber()             { return accountNumber; }
        public void setAccountNumber(String v)       { this.accountNumber = v; }
        public String getAccountType()               { return accountType; }
        public void setAccountType(String v)         { this.accountType = v; }
        public Double getBalance()                   { return balance; }
        public void setBalance(Double v)             { this.balance = v; }
        public String getStatus()                    { return status; }
        public void setStatus(String v)              { this.status = v; }
        public String getBranchName()                { return branchName; }
        public void setBranchName(String v)          { this.branchName = v; }
        public String getIfscCode()                  { return ifscCode; }
        public void setIfscCode(String v)            { this.ifscCode = v; }
    }

    // ── Getters & Setters ────────────────────────────────────────────
    public Long getUserId()                           { return userId; }
    public void setUserId(Long v)                     { this.userId = v; }
    public String getCustomerId()                     { return customerId; }
    public void setCustomerId(String v)               { this.customerId = v; }
    public String getFullName()                       { return fullName; }
    public void setFullName(String v)                 { this.fullName = v; }
    public String getEmail()                          { return email; }
    public void setEmail(String v)                    { this.email = v; }
    public String getPhone()                          { return phone; }
    public void setPhone(String v)                    { this.phone = v; }
    public String getStatus()                         { return status; }
    public void setStatus(String v)                   { this.status = v; }
    public String getKycStatus()                      { return kycStatus; }
    public void setKycStatus(String v)                { this.kycStatus = v; }
    public Set<String> getRoles()                     { return roles; }
    public void setRoles(Set<String> v)               { this.roles = v; }
    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime v)         { this.createdAt = v; }
    public List<AccountSummary> getAccounts()         { return accounts; }
    public void setAccounts(List<AccountSummary> v)   { this.accounts = v; }
}