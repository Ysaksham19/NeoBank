package com.neobank360app.controller;

import com.neobank360app.dto.AdminDashboardDTO;
import com.neobank360app.dto.PendingApprovalDTO;
import com.neobank360app.dto.UserActivityDTO;
import com.neobank360app.entity.User;
import com.neobank360app.entity.UserStatus;
import com.neobank360app.repository.UserRepository;
import com.neobank360app.security.CustomUserPrincipal;
import com.neobank360app.service.AdminDashboardService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    private final AdminDashboardService adminService;
    private final UserRepository        userRepository;

    public AdminDashboardController(AdminDashboardService adminService,
                                    UserRepository userRepository) {
        this.adminService   = adminService;
        this.userRepository = userRepository;
    }

    // ── GET /api/admin/dashboard ──────────────────────────────────
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboard() {
        return ResponseEntity.ok(adminService.buildDashboard());
    }

    // ── GET /api/admin/pending-approvals ──────────────────────────
    // Optional ?module=LOAN filter (reserved for future use)
    @GetMapping("/pending-approvals")
    public ResponseEntity<List<PendingApprovalDTO>> getPendingApprovals(
            @RequestParam(required = false) String module) {
        return ResponseEntity.ok(adminService.getPendingApprovals());
    }

    // ── GET /api/admin/system-health ──────────────────────────────
    @GetMapping("/system-health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(adminService.getSystemHealth());
    }

    // ── GET /api/admin/users ──────────────────────────────────────
    // BR-06: passwordHash intentionally excluded from response
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<User> users = userRepository.findAll(PageRequest.of(page, size));

        List<Map<String, Object>> safeUsers = users.getContent().stream()
                .map(u -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id",         u.getId());
                    m.put("customerNo", u.getCustomerNo());
                    m.put("fullName",   u.getFullName());
                    m.put("email",      u.getEmail());
                    m.put("phone",      u.getPhone());
                    m.put("status",     u.getStatus() != null
                                            ? u.getStatus().name() : null);
                    m.put("kycStatus",  u.getKycStatus());
                    m.put("createdAt",  u.getCreatedAt());
                    m.put("updatedAt",  u.getUpdatedAt());
                    // passwordHash intentionally excluded (BR-06)
                    return m;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "users",         safeUsers,
                "totalPages",    users.getTotalPages(),
                "totalElements", users.getTotalElements(),
                "currentPage",   page
        ));
    }

    // ── PATCH /api/admin/users/{userId}/status ────────────────────
    // Body: { "isActive": true }  → ACTIVE
    //       { "isActive": false } → INACTIVE
    // BR-03: admin cannot deactivate own account → HTTP 400
    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> body,
            @AuthenticationPrincipal CustomUserPrincipal principal) {

        Long actingAdminId = principal.getUser().getId();
        boolean activate   = Boolean.TRUE.equals(body.get("isActive"));

        // BR-03: self-deactivation guard
        if (actingAdminId.equals(userId) && !activate) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error",
                            "Admin cannot deactivate their own account"));
        }

        // Delegates save + audit log to service
        adminService.updateUserStatus(userId, actingAdminId, activate);

        return ResponseEntity.ok(Map.of(
                "message", "User " + (activate ? "activated" : "deactivated")
                           + " successfully.",
                "userId",  userId,
                "status",  activate
                           ? UserStatus.ACTIVE.name()
                           : UserStatus.INACTIVE.name()
        ));
    }

    // ── GET /api/admin/users/{userId}/activity ────────────────────
    @GetMapping("/users/{userId}/activity")
    public ResponseEntity<UserActivityDTO> getUserActivity(
            @PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getUserActivity(userId));
    }
}