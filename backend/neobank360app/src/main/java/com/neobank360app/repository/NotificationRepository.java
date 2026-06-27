package com.neobank360app.repository;

import com.neobank360app.entity.Notification;
import com.neobank360app.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // ── Non-paginated (kept for mark-all-read operation) ────────────────────
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);

    // ── Paginated ────────────────────────────────────────────────────────────

    /**
     * All notifications for a user, newest first — paginated.
     * Default page size: 20.  Usage in controller:
     *   PageRequest.of(page, size)
     */
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    /**
     * Only unread notifications — paginated.
     */
    Page<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user, Pageable pageable);
}
