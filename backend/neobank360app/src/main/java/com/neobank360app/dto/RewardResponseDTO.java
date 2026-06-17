package com.neobank360app.dto;

import com.neobank360app.entity.RewardType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RewardResponseDTO {

    private Long id;

    private RewardType rewardType;

    private BigDecimal amount;

    private String description;

    private LocalDateTime createdAt;

    public RewardResponseDTO() {
    }

    public RewardResponseDTO(
            Long id,
            RewardType rewardType,
            BigDecimal amount,
            String description,
            LocalDateTime createdAt
    ) {

        this.id = id;
        this.rewardType = rewardType;
        this.amount = amount;
        this.description = description;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public RewardType getRewardType() {
        return rewardType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}