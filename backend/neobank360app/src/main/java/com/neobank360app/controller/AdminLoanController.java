package com.neobank360app.controller;

import com.neobank360app.dto.AdminLoanResponseDTO;
import com.neobank360app.service.AdminLoanService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/loans")
@PreAuthorize("hasRole('ADMIN')")
public class AdminLoanController {

    private final AdminLoanService adminLoanService;

    public AdminLoanController(AdminLoanService adminLoanService) {
        this.adminLoanService = adminLoanService;
    }

    // ─── ALL APPLICATIONS (paginated) ─────────────────────────────────────
    // GET /api/v1/admin/loans?page=0&size=20

    @GetMapping
    public ResponseEntity<Page<AdminLoanResponseDTO>> getAllApplications(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                adminLoanService.getAllApplications(page, size));
    }

    // ─── PENDING APPLICATIONS (paginated) ─────────────────────────────────
    // GET /api/v1/admin/loans/pending?page=0&size=20

    @GetMapping("/pending")
    public ResponseEntity<Page<AdminLoanResponseDTO>> getPendingApplications(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                adminLoanService.getPendingApplications(page, size));
    }

    // ─── APPROVE ──────────────────────────────────────────────────────────

    @PutMapping("/{applicationId}/approve")
    public ResponseEntity<AdminLoanResponseDTO> approveLoan(
            @PathVariable Long applicationId,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(
                adminLoanService.approveLoan(applicationId, remarks));
    }

    // ─── REJECT ───────────────────────────────────────────────────────────

    @PutMapping("/{applicationId}/reject")
    public ResponseEntity<AdminLoanResponseDTO> rejectLoan(
            @PathVariable Long applicationId,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.ok(
                adminLoanService.rejectLoan(applicationId, remarks));
    }
}
