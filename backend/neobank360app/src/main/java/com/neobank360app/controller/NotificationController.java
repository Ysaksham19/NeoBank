package com.neobank360app.controller;

import com.neobank360app.dto.NotificationResponseDTO;
import com.neobank360app.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService
            notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {

        this.notificationService =
                notificationService;
    }

    // =========================================================
    // GET ALL NOTIFICATIONS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<NotificationResponseDTO>>
    getMyNotifications() {

        return ResponseEntity.ok(

                notificationService
                        .getMyNotifications()
        );
    }

    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponseDTO>>
    getUnreadNotifications() {

        return ResponseEntity.ok(

                notificationService
                        .getUnreadNotifications()
        );
    }

    // =========================================================
    // MARK AS READ
    // =========================================================

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationResponseDTO>
    markAsRead(

            @PathVariable
            Long notificationId
    ) {

        return ResponseEntity.ok(

                notificationService
                        .markAsRead(
                                notificationId
                        )
        );
    }

    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    @PutMapping("/read-all")
    public ResponseEntity<String>
    markAllAsRead() {

        notificationService.markAllAsRead();

        return ResponseEntity.ok(
                "All notifications marked as read."
        );
    }

    // =========================================================
    // DELETE NOTIFICATION
    // =========================================================

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String>
    deleteNotification(

            @PathVariable
            Long notificationId
    ) {

        notificationService.deleteNotification(
                notificationId
        );

        return ResponseEntity.ok(
                "Notification deleted successfully."
        );
    }
}