package com.neobank360app.controller;

import com.neobank360app.dto.MeResponse;
import com.neobank360app.dto.UpdateProfileRequest;
import com.neobank360app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Handles the authenticated user's own profile operations.
 * All endpoints require a valid Bearer JWT (configured in SecurityConfig).
 */
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * GET /api/v1/users/me
     * Returns the full profile of the authenticated user.
     * This is the primary endpoint the Angular dashboard calls on load
     * to display name, account status, KYC status, and roles.
     */
    @GetMapping("/me")
    public ResponseEntity<MeResponse> getMe() {
        return ResponseEntity.ok(userService.getMe());
    }

    /**
     * PUT /api/v1/users/me
     * Updates mutable profile fields: fullName and phone.
     * Email (login identity) cannot be changed here.
     */
    @PutMapping("/me")
    public ResponseEntity<MeResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(request));
    }
}