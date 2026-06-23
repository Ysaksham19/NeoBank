package com.neobank360app.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RepaymentScheduleDTO {

    private Long          repaymentId;          // ✅ NEW — needed by Pay Now button
    private Integer       instalmentNumber;
    private LocalDate     dueDate;
    private BigDecimal    emiAmount;
    private BigDecimal    principalComponent;
    private BigDecimal    interestComponent;
    private BigDecimal    closingBalance;        // ✅ NEW — outstanding after this EMI
    private BigDecimal    lateFee;              // ✅ NEW — ₹500 penalty if OVERDUE
    private String        paymentStatus;
    private LocalDateTime paidAt;               // ✅ NEW — timestamp when paid

    public RepaymentScheduleDTO() {}

    public Long getRepaymentId() { return repaymentId; }
    public void setRepaymentId(Long repaymentId) { this.repaymentId = repaymentId; }

    public Integer getInstalmentNumber() { return instalmentNumber; }
    public void setInstalmentNumber(Integer instalmentNumber) { this.instalmentNumber = instalmentNumber; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public BigDecimal getEmiAmount() { return emiAmount; }
    public void setEmiAmount(BigDecimal emiAmount) { this.emiAmount = emiAmount; }

    public BigDecimal getPrincipalComponent() { return principalComponent; }
    public void setPrincipalComponent(BigDecimal principalComponent) { this.principalComponent = principalComponent; }

    public BigDecimal getInterestComponent() { return interestComponent; }
    public void setInterestComponent(BigDecimal interestComponent) { this.interestComponent = interestComponent; }

    public BigDecimal getClosingBalance() { return closingBalance; }
    public void setClosingBalance(BigDecimal closingBalance) { this.closingBalance = closingBalance; }

    public BigDecimal getLateFee() { return lateFee; }
    public void setLateFee(BigDecimal lateFee) { this.lateFee = lateFee; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }
}