package com.neobank360app.dto;

import com.neobank360app.entity.BillCategory;
import com.neobank360app.entity.BillStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BillResponseDTO {

    private Long id;

    private BillCategory category;

    private String billerName;

    private BigDecimal amount;

    private LocalDate dueDate;

    private BillStatus status;

    public BillResponseDTO() {
    }

    public BillResponseDTO(
            Long id,
            BillCategory category,
            String billerName,
            BigDecimal amount,
            LocalDate dueDate,
            BillStatus status
    ) {

        this.id = id;
        this.category = category;
        this.billerName = billerName;
        this.amount = amount;
        this.dueDate = dueDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public BillCategory getCategory() {
        return category;
    }

    public String getBillerName() {
        return billerName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public BillStatus getStatus() {
        return status;
    }
}