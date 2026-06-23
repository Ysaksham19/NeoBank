package com.neobank360app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LoanAccountDTO {

    private Long          loanAccountId;
    private String        productName;
    private BigDecimal    principalAmount;
    private BigDecimal    outstandingBalance;   // ✅ NEW
    private BigDecimal    annualInterestRate;
    private Integer       tenureMonths;
    private BigDecimal    emiAmount;
    private String        status;               // ✅ NEW — ACTIVE / CLOSED
    private LocalDateTime disbursedAt;
    private LocalDateTime closedAt;             // ✅ NEW

    public LoanAccountDTO() {}

    public Long getLoanAccountId() { return loanAccountId; }
    public void setLoanAccountId(Long loanAccountId) { this.loanAccountId = loanAccountId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getPrincipalAmount() { return principalAmount; }
    public void setPrincipalAmount(BigDecimal principalAmount) { this.principalAmount = principalAmount; }

    public BigDecimal getOutstandingBalance() { return outstandingBalance; }
    public void setOutstandingBalance(BigDecimal outstandingBalance) { this.outstandingBalance = outstandingBalance; }

    public BigDecimal getAnnualInterestRate() { return annualInterestRate; }
    public void setAnnualInterestRate(BigDecimal annualInterestRate) { this.annualInterestRate = annualInterestRate; }

    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }

    public BigDecimal getEmiAmount() { return emiAmount; }
    public void setEmiAmount(BigDecimal emiAmount) { this.emiAmount = emiAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getDisbursedAt() { return disbursedAt; }
    public void setDisbursedAt(LocalDateTime disbursedAt) { this.disbursedAt = disbursedAt; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }
}