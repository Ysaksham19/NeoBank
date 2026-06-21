package com.neobank360app.dto;

import com.neobank360app.entity.BudgetCategory;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BudgetResponseDTO {

    private Long id;
    private BudgetCategory category;
    private LocalDate budgetMonth;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;      // NEW
    private BigDecimal remainingAmount;  // NEW

    // =========================================================
    // CONSTRUCTORS
    // =========================================================

    public BudgetResponseDTO() {}

    // ✅ NEW 6-arg constructor — used by updated BudgetService
    public BudgetResponseDTO(
            Long id,
            BudgetCategory category,
            LocalDate budgetMonth,
            BigDecimal limitAmount,
            BigDecimal spentAmount,
            BigDecimal remainingAmount
    ) {
        this.id = id;
        this.category = category;
        this.budgetMonth = budgetMonth;
        this.limitAmount = limitAmount;
        this.spentAmount = spentAmount;
        this.remainingAmount = remainingAmount;
    }

    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId()                    { return id; }
    public BudgetCategory getCategory()    { return category; }
    public LocalDate getBudgetMonth()      { return budgetMonth; }
    public BigDecimal getLimitAmount()     { return limitAmount; }
    public BigDecimal getSpentAmount()     { return spentAmount; }
    public BigDecimal getRemainingAmount() { return remainingAmount; }

    // =========================================================
    // SETTERS
    // =========================================================

    public void setId(Long id)                              { this.id = id; }
    public void setCategory(BudgetCategory category)        { this.category = category; }
    public void setBudgetMonth(LocalDate budgetMonth)       { this.budgetMonth = budgetMonth; }
    public void setLimitAmount(BigDecimal limitAmount)      { this.limitAmount = limitAmount; }
    public void setSpentAmount(BigDecimal spentAmount)      { this.spentAmount = spentAmount; }
    public void setRemainingAmount(BigDecimal remaining)    { this.remainingAmount = remaining; }
}