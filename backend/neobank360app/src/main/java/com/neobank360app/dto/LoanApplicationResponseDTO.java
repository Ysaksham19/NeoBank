package com.neobank360app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class LoanApplicationResponseDTO {

    private Long          applicationId;
    private String        productName;
    private BigDecimal    requestedAmount;
    private Integer       requestedTenureMonths;
    private BigDecimal    monthlyIncome;        // ✅ NEW
    private String        loanPurpose;          // ✅ NEW
    private String        status;
    private String        adminRemarks;
    private LocalDateTime appliedAt;

    public LoanApplicationResponseDTO() {}

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public BigDecimal getRequestedAmount() { return requestedAmount; }
    public void setRequestedAmount(BigDecimal requestedAmount) { this.requestedAmount = requestedAmount; }

    public Integer getRequestedTenureMonths() { return requestedTenureMonths; }
    public void setRequestedTenureMonths(Integer requestedTenureMonths) { this.requestedTenureMonths = requestedTenureMonths; }

    public BigDecimal getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(BigDecimal monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public String getLoanPurpose() { return loanPurpose; }
    public void setLoanPurpose(String loanPurpose) { this.loanPurpose = loanPurpose; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}