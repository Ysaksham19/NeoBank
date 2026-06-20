package com.neobank360app.service;

import com.neobank360app.dto.AdminTransactionResponseDTO;
import com.neobank360app.dto.AdminUserResponseDTO;
import com.neobank360app.entity.Transaction;
import com.neobank360app.entity.User;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.TransactionRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public AdminService(
            UserRepository userRepository,
            TransactionRepository transactionRepository
    ) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<AdminUserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        return users.stream()
                .map(this::mapToUserDTO)
                .collect(Collectors.toList());
    }

    public AdminUserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        return mapToUserDTO(user);
    }

    public AdminUserResponseDTO updateUserStatus(
            Long userId,
            String status
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        user.setStatus(status);

        User savedUser = userRepository.save(user);

        return mapToUserDTO(savedUser);
    }

    public List<AdminTransactionResponseDTO> getAllTransactions() {
        return transactionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToTransactionDTO)
                .collect(Collectors.toList());
    }

    private AdminUserResponseDTO mapToUserDTO(User user) {
        AdminUserResponseDTO dto = new AdminUserResponseDTO();

        dto.setId(user.getId());
        dto.setCustomerNo(user.getCustomerNo());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setStatus(user.getStatus());
        dto.setKycStatus(user.getKycStatus());

        return dto;
    }

    private AdminTransactionResponseDTO mapToTransactionDTO(Transaction transaction) {
        AdminTransactionResponseDTO dto = new AdminTransactionResponseDTO();

        dto.setId(transaction.getId());
        dto.setTransactionRef(transaction.getTransactionRef());
        dto.setTransactionType(
                transaction.getTransactionType() != null
                        ? transaction.getTransactionType().name()
                        : null
        );
        dto.setTransactionStatus(
                transaction.getTransactionStatus() != null
                        ? transaction.getTransactionStatus().name()
                        : null
        );
        dto.setAmount(transaction.getAmount());
        dto.setAvailableBalanceAfter(transaction.getAvailableBalanceAfter());
        dto.setLedgerBalanceAfter(transaction.getLedgerBalanceAfter());
        dto.setRemarks(transaction.getRemarks());
        dto.setCreatedAt(transaction.getCreatedAt());

        if (transaction.getAccount() != null) {
            dto.setSenderAccountNo(transaction.getAccount().getAccountNo());

            if (transaction.getAccount().getUser() != null) {
                dto.setCustomerNo(transaction.getAccount().getUser().getCustomerNo());
                dto.setCustomerName(transaction.getAccount().getUser().getFullName());
            }
        }

        if (transaction.getReceiverAccount() != null) {
            dto.setReceiverAccountNo(transaction.getReceiverAccount().getAccountNo());
        }

        return dto;
    }
}