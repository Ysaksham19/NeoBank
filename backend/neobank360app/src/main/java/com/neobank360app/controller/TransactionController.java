package com.neobank360app.controller;

import com.neobank360app.dto.TransactionResponseDTO;
import com.neobank360app.dto.TransferRequestDTO;
import com.neobank360app.service.TransactionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // ─── DEPOSIT ──────────────────────────────────────────────────────────

    @PostMapping("/deposit/{accountId}")
    public ResponseEntity<TransactionResponseDTO> depositMoney(
            @PathVariable Long accountId,
            @RequestParam @NotNull(message = "Amount is required")
            @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
            BigDecimal amount,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.deposit(accountId, amount, remarks));
    }

    // ─── TRANSFER ─────────────────────────────────────────────────────────

    @PostMapping("/transfer/{accountId}")
    public ResponseEntity<TransactionResponseDTO> transferMoney(
            @PathVariable Long accountId,
            @Valid @RequestBody TransferRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.transferMoney(accountId, requestDTO));
    }

    // ─── WITHDRAW ─────────────────────────────────────────────────────────

    @PostMapping("/withdraw/{accountId}")
    public ResponseEntity<TransactionResponseDTO> withdrawMoney(
            @PathVariable Long accountId,
            @RequestParam @NotNull(message = "Amount is required")
            @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
            BigDecimal amount,
            @RequestParam(required = false) String remarks) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.withdraw(accountId, amount, remarks));
    }

    // ─── MINI STATEMENT (last 10 — no pagination needed) ──────────────────

    @GetMapping("/mini-statement/{accountId}")
    public ResponseEntity<List<TransactionResponseDTO>> miniStatement(
            @PathVariable Long accountId) {
        return ResponseEntity.ok(transactionService.getMiniStatement(accountId));
    }

    // ─── FULL STATEMENT — PAGINATED (replaces old non-paginated /{accountId}) ─
    //
    // GET /api/v1/transactions/{accountId}?page=0&size=20
    //
    // page  : 0-based page number (default 0)
    // size  : records per page   (default 20, max capped at 100 in service)
    // Returns: Page<TransactionResponseDTO> with totalElements, totalPages, etc.

    @GetMapping("/{accountId}")
    public ResponseEntity<Page<TransactionResponseDTO>> getTransactions(
            @PathVariable Long accountId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(
                transactionService.getPaginatedTransactions(accountId, page, size));
    }
}
