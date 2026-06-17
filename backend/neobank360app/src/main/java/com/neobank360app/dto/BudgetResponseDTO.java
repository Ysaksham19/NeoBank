package com.neobank360app.dto;

import com.neobank360app.entity.BudgetCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BudgetResponseDTO {

    private Long id;

    private BudgetCategory category;

    private LocalDate budgetMonth;

    private BigDecimal limitAmount;

    public BudgetResponseDTO() {
    }

    public BudgetResponseDTO(
            Long id,
            BudgetCategory category,
            LocalDate budgetMonth,
            BigDecimal limitAmount
    ) {
        this.id = id;
        this.category = category;
        this.budgetMonth = budgetMonth;
        this.limitAmount = limitAmount;
    }

    public Long getId() {
        return id;
    }

    public BudgetCategory getCategory() {
        return category;
    }

    public LocalDate getBudgetMonth() {
        return budgetMonth;
    }

    public BigDecimal getLimitAmount() {
        return limitAmount;
    }
}