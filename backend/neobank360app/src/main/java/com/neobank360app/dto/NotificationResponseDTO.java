package com.neobank360app.dto;

import com.neobank360app.entity.NotificationType;

import java.time.LocalDateTime;

public class NotificationResponseDTO {

    private Long id;
    private NotificationType type;
    private String title;           // ← NEW
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;

    // ── No-arg constructor ──
    public NotificationResponseDTO() {}

    // ── All-args constructor (6 params — title added) ──
    public NotificationResponseDTO(
            Long id,
            NotificationType type,
            String title,           // ← NEW
            String message,
            boolean isRead,
            LocalDateTime createdAt
    ) {
        this.id        = id;
        this.type      = type;
        this.title     = title;     // ← NEW
        this.message   = message;
        this.isRead    = isRead;
        this.createdAt = createdAt;
    }

    // ── Getters ──

    public Long getId() {
        return id;
    }

    public NotificationType getType() {
        return type;
    }

    public String getTitle() {      // ← NEW
        return title;
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