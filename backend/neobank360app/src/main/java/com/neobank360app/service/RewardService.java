package com.neobank360app.service;

import com.neobank360app.dto.RewardResponseDTO;
import com.neobank360app.entity.*;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.RewardRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RewardService {

    private final RewardRepository rewardRepository;
    private final UserRepository userRepository;

    public RewardService(
            RewardRepository rewardRepository,
            UserRepository userRepository
    ) {
        this.rewardRepository = rewardRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE REWARD — always INSERT a NEW row per transaction
    // Each bill payment = its own separate reward history entry
    // =========================================================

    @Transactional
    public void createReward(
            User user,
            RewardType rewardType,
            BigDecimal amount,
            String description
    ) {
        Reward reward = new Reward();
        reward.setUser(user);
        reward.setRewardType(rewardType);
        reward.setAmount(amount);
        reward.setDescription(description);
        rewardRepository.save(reward);  // ✅ ALWAYS INSERT, never upsert
    }

    // =========================================================
    // GET MY REWARDS — returns all rows, newest first
    // =========================================================

    @Transactional(readOnly = true)
    public List<RewardResponseDTO> getMyRewards() {
        User user = getAuthenticatedUser();
        return rewardRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(r -> new RewardResponseDTO(
                        r.getId(),
                        r.getRewardType(),
                        r.getAmount(),
                        r.getDescription(),
                        r.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    // =========================================================
    // TOTAL REWARD POINTS — DB-level SUM across all rows
    // =========================================================

    @Transactional(readOnly = true)
    public BigDecimal getTotalRewards() {
        User user = getAuthenticatedUser();
        BigDecimal total = rewardRepository.sumAmountByUser(user);
        return total != null ? total : BigDecimal.ZERO;
    }

    // =========================================================
    // AUTH USER
    // =========================================================

    private User getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
    }
}