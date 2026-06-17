package com.neobank360app.repository;

import com.neobank360app.entity.Notification;
import com.neobank360app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
    findByUserOrderByCreatedAtDesc(
            User user
    );

    List<Notification>
    findByUserAndIsReadFalseOrderByCreatedAtDesc(
            User user
    );
}