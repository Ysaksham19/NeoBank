package com.neobank360app.service;

import com.neobank360app.dto.NotificationResponseDTO;
import com.neobank360app.entity.Notification;
import com.neobank360app.entity.NotificationType;
import com.neobank360app.entity.User;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.NotificationRepository;
import com.neobank360app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE NOTIFICATION  — @Async so it never blocks the caller
    // =========================================================

    /**
     * Persists a notification asynchronously on the emailTaskExecutor pool.
     * Callers (TransactionService, BillService, etc.) fire-and-forget.
     * If this method throws, it does NOT roll back the caller's transaction.
     */
    @Async("emailTaskExecutor")
    @Transactional
    public CompletableFuture<Void> createNotification(
            User user, NotificationType type, String title, String message) {
        try {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setType(type);
            notification.setTitle(title);
            notification.setMessage(message);
            notificationRepository.save(notification);
            log.debug("[Notification] Created for user={} type={} title={}",
                    user.getId(), type, title);
        } catch (Exception e) {
            // Never let notification failure propagate to caller
            log.error("[Notification] Failed to create notification for user={}: {}",
                    user.getId(), e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    // =========================================================
    // GET ALL NOTIFICATIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getMyNotifications() {
        User user = getAuthenticatedUser();
        List<Notification> notifications =
                notificationRepository.findByUserOrderByCreatedAtDesc(user);
        List<NotificationResponseDTO> response = new ArrayList<>();
        for (Notification notification : notifications) {
            response.add(mapToResponse(notification));
        }
        return response;
    }

    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getUnreadNotifications() {
        User user = getAuthenticatedUser();
        List<Notification> notifications =
                notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        List<NotificationResponseDTO> response = new ArrayList<>();
        for (Notification notification : notifications) {
            response.add(mapToResponse(notification));
        }
        return response;
    }

    // =========================================================
    // MARK AS READ
    // =========================================================

    @Transactional
    public NotificationResponseDTO markAsRead(Long notificationId) {
        User user = getAuthenticatedUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You are not authorized to access this notification.");
        }

        notification.setRead(true);
        return mapToResponse(notificationRepository.save(notification));
    }

    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    @Transactional
    public void markAllAsRead() {
        User user = getAuthenticatedUser();
        List<Notification> unread =
                notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        for (Notification n : unread) {
            n.setRead(true);
        }
        notificationRepository.saveAll(unread);
    }

    // =========================================================
    // DELETE NOTIFICATION
    // =========================================================

    @Transactional
    public void deleteNotification(Long notificationId) {
        User user = getAuthenticatedUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You are not authorized to delete this notification.");
        }

        notificationRepository.delete(notification);
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found: " + email));
    }

    private NotificationResponseDTO mapToResponse(Notification notification) {
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(notification.getId());
        dto.setType(notification.getType());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
