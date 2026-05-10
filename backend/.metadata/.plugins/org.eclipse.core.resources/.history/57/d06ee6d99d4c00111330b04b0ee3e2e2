package com.neobank360app.controller;

import com.neobank360app.dto.MeResponse;
import com.neobank360app.dto.UpdateProfileRequest;
import com.neobank360app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService
    ) {

        this.userService = userService;
    }

    // ───────────────── UPDATE PROFILE ─────────────────

    @PutMapping("/me")
    public ResponseEntity<MeResponse> updateProfile(

            @Valid
            @RequestBody
            UpdateProfileRequest request
    ) {

        return ResponseEntity.ok(
                userService.updateProfile(request)
        );
    }
}