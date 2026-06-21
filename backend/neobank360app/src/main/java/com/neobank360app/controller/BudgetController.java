package com.neobank360app.controller;

import com.neobank360app.dto.BudgetRequestDTO;
import com.neobank360app.dto.BudgetResponseDTO;
import com.neobank360app.dto.BudgetSummaryDTO;
import com.neobank360app.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    // =========================================================
    // CREATE BUDGET
    // =========================================================

    @PostMapping
    public ResponseEntity<BudgetResponseDTO> createBudget(
            @Valid @RequestBody BudgetRequestDTO request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(budgetService.createBudget(request));
    }

    // =========================================================
    // GET MY BUDGETS  (now returns spentAmount + remainingAmount)
    // =========================================================

    @GetMapping
    public ResponseEntity<List<BudgetResponseDTO>> getMyBudgets() {
        return ResponseEntity.ok(budgetService.getMyBudgets());
    }

    // =========================================================
    // UPDATE BUDGET LIMIT
    // =========================================================

    @PutMapping("/{budgetId}")
    public ResponseEntity<BudgetResponseDTO> updateBudget(
            @PathVariable Long budgetId,
            @Valid @RequestBody BudgetRequestDTO request
    ) {
        return ResponseEntity.ok(budgetService.updateBudget(budgetId, request));
    }

    // =========================================================
    // DELETE BUDGET
    // =========================================================

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<String> deleteBudget(
            @PathVariable Long budgetId
    ) {
        budgetService.deleteBudget(budgetId);
        return ResponseEntity.ok("Budget deleted successfully.");
    }

    // =========================================================
    // BUDGET SUMMARY  (unchanged)
    // =========================================================

    @GetMapping("/summary/{userId}")
    public ResponseEntity<List<BudgetSummaryDTO>> getBudgetSummary(
            @PathVariable Long userId,
            @RequestParam String month
    ) {
        return ResponseEntity.ok(budgetService.getBudgetSummary(userId, month));
    }

    // =========================================================
    // BUDGET ALERTS  (>= 80% utilized in current month)
    // =========================================================

    @GetMapping("/alerts")
    public ResponseEntity<List<BudgetSummaryDTO>> getBudgetAlerts() {
        return ResponseEntity.ok(budgetService.getBudgetAlerts());
    }

    // =========================================================
    // COPY LAST MONTH'S BUDGETS
    // =========================================================

    @PostMapping("/copy-last-month")
    public ResponseEntity<List<BudgetResponseDTO>> copyLastMonth() {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(budgetService.copyLastMonthBudgets());
    }

    // =========================================================
    // BUDGET HISTORY  (?months=3 default)
    // =========================================================

    @GetMapping("/history")
    public ResponseEntity<Map<String, List<BudgetSummaryDTO>>> getBudgetHistory(
            @RequestParam(defaultValue = "3") int months
    ) {
        return ResponseEntity.ok(budgetService.getBudgetHistory(months));
    }
}