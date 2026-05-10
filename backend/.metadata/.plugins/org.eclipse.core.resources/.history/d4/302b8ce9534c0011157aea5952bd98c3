package com.neobank360app.controller;

import com.neobank360app.dto.AccountRequestDTO;
import com.neobank360app.dto.AccountResponseDTO;
import com.neobank360app.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(
            AccountService accountService
    ) {

        this.accountService = accountService;
    }

    // ───────────────── CREATE ACCOUNT ─────────────────

    @PostMapping
    public ResponseEntity<AccountResponseDTO> createAccount(
            @Valid @RequestBody AccountRequestDTO requestDTO
    ) {

        AccountResponseDTO response =
                accountService.createAccount(requestDTO);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ───────────────── GET MY ACCOUNTS ─────────────────

    @GetMapping
    public ResponseEntity<List<AccountResponseDTO>> getMyAccounts() {

        List<AccountResponseDTO> accounts =
                accountService.getMyAccounts();

        return ResponseEntity.ok(accounts);
    }

    // ───────────────── GET ACCOUNT BY ID ─────────────────

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountResponseDTO> getAccountById(
            @PathVariable Long accountId
    ) {

        AccountResponseDTO account =
                accountService.getAccountById(accountId);

        return ResponseEntity.ok(account);
    }
}