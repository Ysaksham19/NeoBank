package com.neobank360app.controller;

import com.neobank360app.dto.FinancialInsightsDTO;
import com.neobank360app.security.CustomUserPrincipal;
import com.neobank360app.service.InsightsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/insights")
public class InsightsController {

    private final InsightsService insightsService;

    public InsightsController(InsightsService insightsService) {
        this.insightsService = insightsService;
    }

    /**
     * GET /api/insights/{userId}
     * Returns financial insights for the authenticated user.
     * JWT userId must match path userId — HTTP 403 if mismatch (BR-01).
     */
    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getInsights(
            @PathVariable Long userId,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        Long jwtUserId = principal.getUser().getId();

        // BR-01: cross-user access guard
        if (!jwtUserId.equals(userId)) {
            return ResponseEntity.status(403)
                    .body("Access denied: you can only view your own insights.");
        }

        FinancialInsightsDTO dto = insightsService.buildInsights(userId);
        return ResponseEntity.ok(dto);
    }
}