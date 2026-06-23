package com.neobank360app.repository;

import com.neobank360app.entity.Reward;
import com.neobank360app.entity.RewardType;
import com.neobank360app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface RewardRepository extends JpaRepository<Reward, Long> {

    // ✅ NEW — returns all rows for user, newest first
    List<Reward> findByUserOrderByCreatedAtDesc(User user);

    // kept for any other code that may use it
    List<Reward> findByUser(User user);

    // no longer used by service but kept safe
    Optional<Reward> findByUserAndRewardType(User user, RewardType rewardType);

    @Query("SELECT COALESCE(SUM(r.amount), 0) FROM Reward r WHERE r.user = :user")
    BigDecimal sumAmountByUser(@Param("user") User user);
}