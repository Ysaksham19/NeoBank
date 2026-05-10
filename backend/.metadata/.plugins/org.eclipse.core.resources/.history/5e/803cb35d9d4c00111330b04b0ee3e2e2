package com.neobank360app.controller;

import com.neobank360app.dto.AdminUserResponseDTO;
import com.neobank360app.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService
    ) {

        this.adminService = adminService;
    }

    // ───────────────── GET ALL USERS ─────────────────

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponseDTO>>
    getAllUsers() {

        return ResponseEntity.ok(
                adminService.getAllUsers()
        );
    }

    // ───────────────── GET USER BY ID ─────────────────

    @GetMapping("/users/{userId}")
    public ResponseEntity<AdminUserResponseDTO>
    getUserById(

            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                adminService.getUserById(userId)
        );
    }

    // ───────────────── UPDATE USER STATUS ─────────────────

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<AdminUserResponseDTO>
    updateUserStatus(

            @PathVariable Long userId,

            @RequestParam String status
    ) {

        return ResponseEntity.ok(
                adminService.updateUserStatus(
                        userId,
                        status
                )
        );
    }
}