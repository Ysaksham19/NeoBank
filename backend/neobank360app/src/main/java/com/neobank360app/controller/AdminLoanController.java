package com.neobank360app.controller;

import com.neobank360app.dto.LoanApplicationResponseDTO;
import com.neobank360app.dto.LoanDecisionDTO;
import com.neobank360app.service.LoanApplicationService;
import com.neobank360app.service.LoanDecisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/loans")   // ← fixed: was /api/v1/loans
@PreAuthorize("hasRole('ADMIN')")
public class AdminLoanController {

    private final LoanDecisionService loanDecisionService;
    private final LoanApplicationService loanApplicationService;

    public AdminLoanController(
            LoanDecisionService loanDecisionService,
            LoanApplicationService loanApplicationService) {
        this.loanDecisionService = loanDecisionService;
        this.loanApplicationService = loanApplicationService;
    }

    // GET /api/v1/admin/loans/applications
    @GetMapping("/applications")          // ← fixed: was /admin/applications
    public ResponseEntity<List<LoanApplicationResponseDTO>> getAllApplications() {
        return ResponseEntity.ok(
                loanApplicationService.getAllApplications());
    }

    // PUT /api/v1/admin/loans/{loanApplicationId}/decision
    @PutMapping("/{loanApplicationId}/decision")
    public ResponseEntity<String> decideLoan(
            @PathVariable Long loanApplicationId,
            @RequestBody LoanDecisionDTO dto) {
        return ResponseEntity.ok(
                loanDecisionService.decideLoan(loanApplicationId, dto));
    }
}