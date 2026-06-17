package com.neobank360app.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RepaymentScheduleDTO {

    private Integer instalmentNumber;

    private LocalDate dueDate;

    private BigDecimal emiAmount;

    private BigDecimal principalComponent;

    private BigDecimal interestComponent;

    private String paymentStatus;

    public RepaymentScheduleDTO() {
    }

    public Integer getInstalmentNumber() {
        return instalmentNumber;
    }

    public void setInstalmentNumber(Integer instalmentNumber) {
        this.instalmentNumber = instalmentNumber;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BigDecimal getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(BigDecimal emiAmount) {
        this.emiAmount = emiAmount;
    }

    public BigDecimal getPrincipalComponent() {
        return principalComponent;
    }

    public void setPrincipalComponent(BigDecimal principalComponent) {
        this.principalComponent = principalComponent;
    }

    public BigDecimal getInterestComponent() {
        return interestComponent;
    }

    public void setInterestComponent(BigDecimal interestComponent) {
        this.interestComponent = interestComponent;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}