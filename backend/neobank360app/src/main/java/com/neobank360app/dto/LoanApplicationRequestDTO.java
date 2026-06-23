package com.neobank360app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class LoanApplicationRequestDTO {

    @NotNull(message = "Loan product id is required")
    private Long loanProductId;

    @NotNull(message = "Requested amount is required")
    @Positive(message = "Requested amount must be positive")
    private BigDecimal requestedAmount;

    @NotNull(message = "Requested tenure is required")
    @Positive(message = "Requested tenure must be positive")
    private Integer requestedTenureMonths;

    @NotNull(message = "Monthly income is required")         // ✅ NEW
    @Positive(message = "Monthly income must be positive")   // ✅ NEW
    private BigDecimal monthlyIncome;

    @NotBlank(message = "Loan purpose is required")          // ✅ NEW
    private String loanPurpose;

    public LoanApplicationRequestDTO() {}

    public Long getLoanProductId() { return loanProductId; }
    public void setLoanProductId(Long loanProductId) { this.loanProductId = loanProductId; }

    public BigDecimal getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(BigDecimal requestedAmount) { this.requestedAmount = requestedAmount; }

    public Integer getRequestedTenureMonths() { return requestedTenureMonths; }
    public void setRequestedTenureMonths(Integer requestedTenureMonths) { this.requestedTenureMonths = requestedTenureMonths; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public String getLoanPurpose() { return loanPurpose; }
    public void setLoanPurpose(String loanPurpose) { this.loanPurpose = loanPurpose; }
}