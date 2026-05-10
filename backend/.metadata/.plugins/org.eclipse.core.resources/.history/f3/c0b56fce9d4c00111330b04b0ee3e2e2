package com.neobank360app.service;

import com.neobank360app.dto.MeResponse;
import com.neobank360app.dto.UpdateProfileRequest;
import com.neobank360app.entity.User;
import com.neobank360app.exception.DuplicateResourceException;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(
            UserRepository userRepository
    ) {

        this.userRepository = userRepository;
    }

    // ───────────────── UPDATE PROFILE ─────────────────

    public MeResponse updateProfile(
            UpdateProfileRequest request
    ) {

        User user =
                getAuthenticatedUser();

        if (!user.getPhone()
                .equals(request.getPhone())
                &&
                userRepository.existsByPhone(
                        request.getPhone()
                )) {

            throw new DuplicateResourceException(
                    "Phone number already exists."
            );
        }

        user.setFullName(
                request.getFullName()
        );

        user.setPhone(
                request.getPhone()
        );

        User savedUser =
                userRepository.save(user);

        return mapToMeResponse(savedUser);
    }

    // ───────────────── GET AUTH USER ─────────────────

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));
    }

    // ───────────────── DTO MAPPER ─────────────────

    private MeResponse mapToMeResponse(
            User user
    ) {

        MeResponse response =
                new MeResponse();

        response.setUserId(
                user.getId()
        );

        response.setCustomerId(
                user.getCustomerNo()
        );

        response.setFullName(
                user.getFullName()
        );

        response.setEmail(
                user.getEmail()
        );

        response.setPhone(
                user.getPhone()
        );

        response.setKycStatus(
                user.getKycStatus()
        );

        return response;
    }
}

