package com.neobank360app.dto;

import java.math.BigDecimal;

public class AdminAccountResponseDTO {

    private Long id;
    private String accountNo;
    private String accountType;  // String — converted from enum in mapper
    private String status;       // String — converted from AccountStatus enum in mapper
    private String currency;
    private BigDecimal availableBalance;
    private BigDecimal ledgerBalance;
    private Long userId;
    private String customerNo;
    private String customerName;

    public AdminAccountResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getAvailableBalance() { return availableBalance; }
    public void setAvailableBalance(BigDecimal availableBalance) { this.availableBalance = availableBalance; }

    public BigDecimal getLedgerBalance() { return ledgerBalance; }
    public void setLedgerBalance(BigDecimal ledgerBalance) { this.ledgerBalance = ledgerBalance; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCustomerNo() { return customerNo; }
    public void setCustomerNo(String customerNo) { this.customerNo = customerNo; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
}