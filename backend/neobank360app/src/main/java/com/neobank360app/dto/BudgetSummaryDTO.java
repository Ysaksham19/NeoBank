package com.neobank360app.dto;

import com.neobank360app.entity.BudgetCategory;

import java.math.BigDecimal;

public class BudgetSummaryDTO {

    private BudgetCategory category;

    private BigDecimal limitAmount;

    private BigDecimal spentAmount;

    private BigDecimal remainingAmount;

    private Double utilizationPercentage;

    public BudgetSummaryDTO() {
    }

    public BudgetSummaryDTO(
            BudgetCategory category,
            BigDecimal limitAmount,
            BigDecimal spentAmount,
            BigDecimal remainingAmount,
            Double utilizationPercentage
    ) {

        this.category = category;
        this.limitAmount = limitAmount;
        this.spentAmount = spentAmount;
        this.remainingAmount = remainingAmount;
        this.utilizationPercentage = utilizationPercentage;
    }

    public BudgetCategory getCategory() {
        return category;
    }

    public void setCategory(
            BudgetCategory category
    ) {
        this.category = category;
    }

    public BigDecimal getLimitAmount() {
        return limitAmount;
    }

    public void setLimitAmount(
            BigDecimal limitAmount
    ) {
        this.limitAmount = limitAmount;
    }

    public BigDecimal getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(
            BigDecimal spentAmount
    ) {
        this.spentAmount = spentAmount;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(
            BigDecimal remainingAmount
    ) {
        this.remainingAmount = remainingAmount;
    }

    public Double getUtilizationPercentage() {
        return utilizationPercentage;
    }

    public void setUtilizationPercentage(
            Double utilizationPercentage
    ) {
        this.utilizationPercentage = utilizationPercentage;
    }
}