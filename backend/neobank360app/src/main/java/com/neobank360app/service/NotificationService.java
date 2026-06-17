package com.neobank360app.service;

import com.neobank360app.dto.NotificationResponseDTO;
import com.neobank360app.entity.Notification;
import com.neobank360app.entity.NotificationType;
import com.neobank360app.entity.User;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.NotificationRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository
            notificationRepository;

    private final UserRepository
            userRepository;

    public NotificationService(

            NotificationRepository
                    notificationRepository,

            UserRepository
                    userRepository
    ) {

        this.notificationRepository =
                notificationRepository;

        this.userRepository =
                userRepository;
    }

    // =========================================================
    // CREATE NOTIFICATION
    // =========================================================

    @Transactional
    public void createNotification(

            User user,

            NotificationType type,

            String message
    ) {

        Notification notification =
                new Notification();

        notification.setUser(user);

        notification.setType(type);

        notification.setMessage(message);

        notificationRepository.save(
                notification
        );
    }

    // =========================================================
    // GET ALL NOTIFICATIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<NotificationResponseDTO>
    getMyNotifications() {

        User user =
                getAuthenticatedUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserOrderByCreatedAtDesc(
                                user
                        );

        List<NotificationResponseDTO>
                response =
                new ArrayList<>();

        for (Notification notification
                : notifications) {

            response.add(
                    mapToResponse(notification)
            );
        }

        return response;
    }

    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<NotificationResponseDTO>
    getUnreadNotifications() {

        User user =
                getAuthenticatedUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserAndIsReadFalseOrderByCreatedAtDesc(
                                user
                        );

        List<NotificationResponseDTO>
                response =
                new ArrayList<>();

        for (Notification notification
                : notifications) {

            response.add(
                    mapToResponse(notification)
            );
        }

        return response;
    }

    // =========================================================
    // MARK AS READ
    // =========================================================

    @Transactional
    public NotificationResponseDTO
    markAsRead(
            Long notificationId
    ) {

        User user =
                getAuthenticatedUser();

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->

                                new ResourceNotFoundException(
                                        "Notification not found."
                                )
                        );

        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You are not authorized to access this notification."
            );
        }

        notification.setRead(true);

        Notification updatedNotification =
                notificationRepository.save(
                        notification
                );

        return mapToResponse(
                updatedNotification
        );
    }

    // =========================================================
    // MARK ALL AS READ
    // =========================================================

    @Transactional
    public void markAllAsRead() {

        User user =
                getAuthenticatedUser();

        List<Notification> notifications =
                notificationRepository
                        .findByUserAndIsReadFalseOrderByCreatedAtDesc(
                                user
                        );

        for (Notification notification
                : notifications) {

            notification.setRead(true);

            notificationRepository.save(
                    notification
            );
        }
    }

    // =========================================================
    // DELETE NOTIFICATION
    // =========================================================

    @Transactional
    public void deleteNotification(
            Long notificationId
    ) {

        User user =
                getAuthenticatedUser();

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->

                                new ResourceNotFoundException(
                                        "Notification not found."
                                )
                        );

        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new IllegalArgumentException(
                    "You are not authorized to delete this notification."
            );
        }

        notificationRepository.delete(
                notification
        );
    }

    // =========================================================
    // RESPONSE MAPPER
    // =========================================================

    private NotificationResponseDTO
    mapToResponse(
            Notification notification
    ) {

        return new NotificationResponseDTO(

                notification.getId(),

                notification.getType(),

                notification.getMessage(),

                notification.isRead(),

                notification.getCreatedAt()
        );
    }

    // =========================================================
    // AUTH USER
    // =========================================================

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->

                        new ResourceNotFoundException(
                                "User not found."
                        )
                );
    }
}