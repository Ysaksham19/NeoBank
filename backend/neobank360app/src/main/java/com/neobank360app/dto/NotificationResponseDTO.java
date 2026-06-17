package com.neobank360app.dto;

import com.neobank360app.entity.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponseDTO {

    private Long id;

    private NotificationType type;

    private String message;

    private boolean isRead;

    private LocalDateTime createdAt;

    public NotificationResponseDTO() {
    }

    public NotificationResponseDTO(
            Long id,
            NotificationType type,
            String message,
            boolean isRead,
            LocalDateTime createdAt
    ) {

        this.id = id;
        this.type = type;
        this.message = message;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public NotificationType getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public boolean isRead() {
        return isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}