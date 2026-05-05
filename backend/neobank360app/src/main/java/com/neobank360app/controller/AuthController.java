package com.neobank360app.controller;

import com.neobank360app.dto.*;
import com.neobank360app.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // STEP 1 — Select account type
    @PostMapping("/register/account-type")
    public ResponseEntity<AccountTypeSelectionResponse> selectAccountType(
            @Valid @RequestBody AccountTypeSelectionRequest request) {
        return ResponseEntity.ok(authService.selectAccountType(request));
    }

    // STEP 4 — Final registration
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // ME
    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.me(userDetails.getUsername()));
    }
}