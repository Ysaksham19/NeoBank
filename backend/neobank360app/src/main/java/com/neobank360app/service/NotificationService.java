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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private static final int MAX_PAGE_SIZE = 100;

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // ─── CREATE (async — never blocks caller's transaction) ───────────────

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
            log.debug("[Notification] created user={} type={}", user.getId(), type);
        } catch (Exception e) {
            log.error("[Notification] failed for user={}: {}", user.getId(), e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    // ─── GET ALL (paginated) ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<NotificationResponseDTO> getMyNotifications(int page, int size) {
        User user = getAuthenticatedUser();
        PageRequest pr = PageRequest.of(page, Math.min(size, MAX_PAGE_SIZE));
        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user, pr)
                .map(this::mapToResponse);
    }

    // ─── GET UNREAD (paginated) ────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<NotificationResponseDTO> getUnreadNotifications(int page, int size) {
        User user = getAuthenticatedUser();
        PageRequest pr = PageRequest.of(page, Math.min(size, MAX_PAGE_SIZE));
        return notificationRepository
                .findByUserAndIsReadFalseOrderByCreatedAtDesc(user, pr)
                .map(this::mapToResponse);
    }

    // ─── MARK AS READ ─────────────────────────────────────────────────────

    @Transactional
    public NotificationResponseDTO markAsRead(Long notificationId) {
        User user = getAuthenticatedUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized to access this notification.");
        }
        notification.setRead(true);
        return mapToResponse(notificationRepository.save(notification));
    }

    // ─── MARK ALL AS READ ─────────────────────────────────────────────────

    @Transactional
    public void markAllAsRead() {
        User user = getAuthenticatedUser();
        List<Notification> unread =
                notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // ─── DELETE ───────────────────────────────────────────────────────────

    @Transactional
    public void deleteNotification(Long notificationId) {
        User user = getAuthenticatedUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Not authorized to delete this notification.");
        }
        notificationRepository.delete(notification);
    }

    // ─── HELPERS ──────────────────────────────────────────────────────────

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Authenticated user not found: " + auth.getName()));
    }

    private NotificationResponseDTO mapToResponse(Notification n) {
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(n.getId());
        dto.setType(n.getType());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setRead(n.isRead());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
