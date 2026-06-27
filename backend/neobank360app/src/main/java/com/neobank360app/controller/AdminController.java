package com.neobank360app.controller;

import com.neobank360app.dto.AdminAccountResponseDTO;
import com.neobank360app.dto.AdminTransactionResponseDTO;
import com.neobank360app.dto.AdminUserResponseDTO;
import com.neobank360app.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ─── USERS ────────────────────────────────────────────────────────────
    // GET /api/v1/admin/users?page=0&size=20

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponseDTO>> getAllUsers(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<AdminUserResponseDTO> getUserById(
            @PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getUserById(userId));
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<AdminUserResponseDTO> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam String status) {
        return ResponseEntity.ok(adminService.updateUserStatus(userId, status));
    }

    // ─── KYC ──────────────────────────────────────────────────────────────
    // GET /api/v1/admin/kyc/pending?page=0&size=20

    @GetMapping("/kyc/pending")
    public ResponseEntity<Page<AdminUserResponseDTO>> getPendingKycUsers(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getPendingKycUsers(page, size));
    }

    @PutMapping("/kyc/{userId}/status")
    public ResponseEntity<AdminUserResponseDTO> updateKycStatus(
            @PathVariable Long userId,
            @RequestParam String kycStatus) {
        return ResponseEntity.ok(adminService.updateKycStatus(userId, kycStatus));
    }

    // ─── ACCOUNTS ─────────────────────────────────────────────────────────
    // GET /api/v1/admin/accounts?page=0&size=20

    @GetMapping("/accounts")
    public ResponseEntity<Page<AdminAccountResponseDTO>> getAllAccounts(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getAllAccounts(page, size));
    }

    @GetMapping("/users/{userId}/accounts")
    public ResponseEntity<List<AdminAccountResponseDTO>> getAccountsByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getAccountsByUser(userId));
    }

    @PutMapping("/accounts/{accountId}/status")
    public ResponseEntity<AdminAccountResponseDTO> updateAccountStatus(
            @PathVariable Long accountId,
            @RequestParam String status) {
        return ResponseEntity.ok(adminService.updateAccountStatus(accountId, status));
    }

    // ─── TRANSACTIONS ─────────────────────────────────────────────────────
    // GET /api/v1/admin/transactions?page=0&size=20

    @GetMapping("/transactions")
    public ResponseEntity<Page<AdminTransactionResponseDTO>> getAllTransactions(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getAllTransactions(page, size));
    }
}
