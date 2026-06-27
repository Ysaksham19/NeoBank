package com.neobank360app.repository;

import com.neobank360app.entity.Reward;
import com.neobank360app.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RewardRepository extends JpaRepository<Reward, Long> {

    // ── Non-paginated (kept for total-points calculation) ───────────────────
    List<Reward> findByUserOrderByCreatedAtDesc(User user);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Reward r WHERE r.user = :user")
    Double sumRewardPointsByUser(@Param("user") User user);

    // ── Paginated ────────────────────────────────────────────────────────────

    /**
     * Reward history for a user, newest first — paginated.
     */
    Page<Reward> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
