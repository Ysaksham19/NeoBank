package com.neobank360app.service;

import com.neobank360app.dto.AdminUserResponseDTO;
import com.neobank360app.entity.User;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(
            UserRepository userRepository
    ) {

        this.userRepository = userRepository;
    }

    // ───────────────── GET ALL USERS ─────────────────

    public List<AdminUserResponseDTO> getAllUsers() {

        List<User> users =
                userRepository.findAll();

        return users.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ───────────────── GET USER BY ID ─────────────────

    public AdminUserResponseDTO getUserById(
            Long userId
    ) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found."
                                ));

        return mapToDTO(user);
    }

    // ───────────────── UPDATE USER STATUS ─────────────────

    public AdminUserResponseDTO updateUserStatus(
            Long userId,
            String status
    ) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "User not found."
                                ));

        user.setStatus(status);

        User savedUser =
                userRepository.save(user);

        return mapToDTO(savedUser);
    }

    // ───────────────── PRIVATE MAPPER ─────────────────

    private AdminUserResponseDTO mapToDTO(
            User user
    ) {

        AdminUserResponseDTO dto =
                new AdminUserResponseDTO();

        dto.setId(user.getId());

        dto.setCustomerNo(
                user.getCustomerNo()
        );

        dto.setFullName(
                user.getFullName()
        );

        dto.setEmail(
                user.getEmail()
        );

        dto.setPhone(
                user.getPhone()
        );

        dto.setStatus(
                user.getStatus()
        );

        dto.setKycStatus(
                user.getKycStatus()
        );

        return dto;
    }
}