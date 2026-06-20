package com.neobank360app.service;

import com.neobank360app.dto.MeResponse;
import com.neobank360app.dto.UpdateProfileRequest;
import com.neobank360app.entity.Role;
import com.neobank360app.entity.User;
import com.neobank360app.exception.DuplicateResourceException;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ─── GET PROFILE ─────────────────────────────────────────────────────────────

    /**
     * Returns the full profile of the currently authenticated user.
     * Called by GET /api/v1/users/me.
     * Populates: userId, customerId, fullName, email, phone,
     *            status, kycStatus, roles, createdAt.
     */
    public MeResponse getMe() {
        return mapToMeResponse(getAuthenticatedUser());
    }

    // ─── UPDATE PROFILE ───────────────────────────────────────────────────────────

    /**
     * Updates mutable profile fields: fullName and phone.
     * Email is the login identity and is NOT editable here.
     *
     * Null-safe phone check: user.getPhone() may be null on first login
     * before phone was set — using equals() on null causes NPE.
     */
    public MeResponse updateProfile(UpdateProfileRequest request) {
        User user = getAuthenticatedUser();

        if (request.getPhone() != null
                && !request.getPhone().equals(user.getPhone())
                && userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Phone number already in use.");
        }

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        return mapToMeResponse(userRepository.save(user));
    }

    // ─── HELPERS ─────────────────────────────────────────────────────────────────

    /**
     * Resolves the authenticated user from the Spring SecurityContext.
     * Throws 404 if the email in the JWT no longer exists in DB
     * (e.g. account was deleted after token was issued).
     */
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }

    /**
     * Maps a User entity to MeResponse DTO.
     * All fields populated — status (enum.name()), roles (Set<String>), createdAt.
     * passwordHash intentionally excluded.
     */
    private MeResponse mapToMeResponse(User user) {
        MeResponse response = new MeResponse();
        response.setUserId(user.getId());
        response.setCustomerId(user.getCustomerNo());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus() != null ? user.getStatus().name() : null);
        response.setKycStatus(user.getKycStatus());
        response.setCreatedAt(user.getCreatedAt());
        response.setRoles(
                user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toSet())
        );
        return response;
    }
}
