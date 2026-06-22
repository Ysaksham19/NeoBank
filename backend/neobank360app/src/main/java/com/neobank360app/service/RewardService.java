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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    // CREATE REWARD — upsert pattern
    // Accumulates amount if reward of same type already exists,
    // so duplicate-key DB constraint can never crash the app.
    // =========================================================

    @Transactional
    public void createReward(
            User user,
            RewardType rewardType,
            BigDecimal amount,
            String description
    ) {
        Optional<Reward> existing =
                rewardRepository.findByUserAndRewardType(user, rewardType);

        if (existing.isPresent()) {
            Reward reward = existing.get();
            reward.setAmount(reward.getAmount().add(amount));
            reward.setDescription(description);
            rewardRepository.save(reward);
        } else {
            Reward reward = new Reward();
            reward.setUser(user);
            reward.setRewardType(rewardType);
            reward.setAmount(amount);
            reward.setDescription(description);
            rewardRepository.save(reward);
        }
    }

    // =========================================================
    // GET MY REWARDS
    // =========================================================

    @Transactional(readOnly = true)
    public List<RewardResponseDTO> getMyRewards() {

        User user = getAuthenticatedUser();
        List<Reward> rewards = rewardRepository.findByUser(user);
        List<RewardResponseDTO> response = new ArrayList<>();

        for (Reward reward : rewards) {
            response.add(new RewardResponseDTO(
                    reward.getId(),
                    reward.getRewardType(),
                    reward.getAmount(),
                    reward.getDescription(),
                    reward.getCreatedAt()
            ));
        }

        return response;
    }

    // =========================================================
    // TOTAL REWARD POINTS — DB-level SUM, no full fetch
    // =========================================================

    @Transactional(readOnly = true)
    public BigDecimal getTotalRewards() {
        User user = getAuthenticatedUser();
        return rewardRepository.sumAmountByUser(user);
    }

    // =========================================================
    // AUTH USER
    // =========================================================

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
    }
}