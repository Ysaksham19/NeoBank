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

@RestController
@RequestMapping("/api/v1/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(
            BudgetService budgetService
    ) {

        this.budgetService = budgetService;
    }

    // =========================================================
    // CREATE BUDGET
    // =========================================================

    @PostMapping
    public ResponseEntity<BudgetResponseDTO>
    createBudget(

            @Valid
            @RequestBody
            BudgetRequestDTO request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        budgetService.createBudget(
                                request
                        )
                );
    }

    // =========================================================
    // GET MY BUDGETS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<BudgetResponseDTO>>
    getMyBudgets() {

        return ResponseEntity.ok(
                budgetService.getMyBudgets()
        );
    }

    // =========================================================
    // DELETE BUDGET
    // =========================================================

    @DeleteMapping("/{budgetId}")
    public ResponseEntity<String>
    deleteBudget(

            @PathVariable
            Long budgetId
    ) {

        budgetService.deleteBudget(
                budgetId
        );

        return ResponseEntity.ok(
                "Budget deleted successfully."
        );
    }

    // =========================================================
    // BUDGET SUMMARY
    // =========================================================

    @GetMapping("/summary/{userId}")
    public ResponseEntity<List<BudgetSummaryDTO>>
    getBudgetSummary(

            @PathVariable
            Long userId,

            @RequestParam
            String month
    ) {

        return ResponseEntity.ok(

                budgetService.getBudgetSummary(
                        userId,
                        month
                )
        );
    }
}