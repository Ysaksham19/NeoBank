package com.neobank360app.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.neobank360app.entity.BillCategory;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BillRequestDTO {

    @NotNull(message = "Category is required")
    private BillCategory category;

    @NotBlank(message = "Biller name is required")
    private String billerName;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date cannot be in the past")
    @JsonFormat(pattern = "yyyy-MM-dd")  
    private LocalDate dueDate;

    public BillRequestDTO() {}

    public BillCategory getCategory() { return category; }
    public void setCategory(BillCategory category) { this.category = category; }

    public String getBillerName() { return billerName; }
    public void setBillerName(String billerName) { this.billerName = billerName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}