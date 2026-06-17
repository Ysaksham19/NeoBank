package com.neobank360app.dto;

import com.neobank360app.entity.BudgetCategory;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BudgetRequestDTO {

    @NotNull(message = "Category is required")
    private BudgetCategory category;

    @NotNull(message = "Budget month is required")
    private LocalDate budgetMonth;

    @NotNull(message = "Limit amount is required")
    @Positive(message = "Limit amount must be greater than zero")
    private BigDecimal limitAmount;

    public BudgetRequestDTO() {
    }

    public BudgetCategory getCategory() {
        return category;
    }

    public void setCategory(BudgetCategory category) {
        this.category = category;
    }

    public LocalDate getBudgetMonth() {
        return budgetMonth;
    }

    public void setBudgetMonth(LocalDate budgetMonth) {
        this.budgetMonth = budgetMonth;
    }

    public BigDecimal getLimitAmount() {
        return limitAmount;
    }

    public void setLimitAmount(BigDecimal limitAmount) {
        this.limitAmount = limitAmount;
    }
}