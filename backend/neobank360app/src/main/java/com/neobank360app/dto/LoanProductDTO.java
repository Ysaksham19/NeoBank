package com.neobank360app.dto;

import java.math.BigDecimal;

public class LoanProductDTO {

    private Long id;

    private String productName;

    private BigDecimal minAmount;

    private BigDecimal maxAmount;

    private BigDecimal annualInterestRate;

    private String allowedTenures;

    public LoanProductDTO() {
    }

    public Long getId() {
        return id;
    }

    public String getProductName() {
        return productName;
    }

    public BigDecimal getMinAmount() {
        return minAmount;
    }

    public BigDecimal getMaxAmount() {
        return maxAmount;
    }

    public BigDecimal getAnnualInterestRate() {
        return annualInterestRate;
    }

    public String getAllowedTenures() {
        return allowedTenures;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public void setMinAmount(BigDecimal minAmount) {
        this.minAmount = minAmount;
    }

    public void setMaxAmount(BigDecimal maxAmount) {
        this.maxAmount = maxAmount;
    }

    public void setAnnualInterestRate(BigDecimal annualInterestRate) {
        this.annualInterestRate = annualInterestRate;
    }

    public void setAllowedTenures(String allowedTenures) {
        this.allowedTenures = allowedTenures;
    }
}