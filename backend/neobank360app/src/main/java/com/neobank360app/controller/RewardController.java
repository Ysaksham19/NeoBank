package com.neobank360app.controller;

import com.neobank360app.dto.RewardResponseDTO;
import com.neobank360app.service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/rewards")
public class RewardController {

    private final RewardService rewardService;

    public RewardController(
            RewardService rewardService
    ) {

        this.rewardService = rewardService;
    }

    // =========================================================
    // GET MY REWARDS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<RewardResponseDTO>>
    getMyRewards() {

        return ResponseEntity.ok(
                rewardService.getMyRewards()
        );
    }

    // =========================================================
    // TOTAL REWARD BALANCE
    // =========================================================

    @GetMapping("/total")
    public ResponseEntity<BigDecimal>
    getTotalRewards() {

        return ResponseEntity.ok(
                rewardService.getTotalRewards()
        );
    }
}