package com.neobank360app.controller;

import com.neobank360app.dto.NotificationResponseDTO;
import com.neobank360app.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ─── GET ALL (paginated) ──────────────────────────────────────────────
    // GET /api/v1/notifications?page=0&size=20

    @GetMapping
    public ResponseEntity<Page<NotificationResponseDTO>> getMyNotifications(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                notificationService.getMyNotifications(page, size));
    }

    // ─── GET UNREAD (paginated) ────────────────────────────────────────────
    // GET /api/v1/notifications/unread?page=0&size=20

    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationResponseDTO>> getUnreadNotifications(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(page, size));
    }

    // ─── MARK AS READ ─────────────────────────────────────────────────────

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(
            @PathVariable Long notificationId) {
        return ResponseEntity.ok(
                notificationService.markAsRead(notificationId));
    }

    // ─── MARK ALL AS READ ─────────────────────────────────────────────────

    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok("All notifications marked as read.");
    }

    // ─── DELETE ───────────────────────────────────────────────────────────

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok("Notification deleted successfully.");
    }
}
