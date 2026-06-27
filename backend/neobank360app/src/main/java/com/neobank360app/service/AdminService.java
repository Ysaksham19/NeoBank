package com.neobank360app.service;

import com.neobank360app.dto.AdminAccountResponseDTO;
import com.neobank360app.dto.AdminTransactionResponseDTO;
import com.neobank360app.dto.AdminUserResponseDTO;
import com.neobank360app.entity.Account;
import com.neobank360app.entity.AccountStatus;
import com.neobank360app.entity.Transaction;
import com.neobank360app.entity.User;
import com.neobank360app.entity.UserStatus;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.AccountRepository;
import com.neobank360app.repository.TransactionRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    public AdminService(
            UserRepository userRepository,
            TransactionRepository transactionRepository,
            AccountRepository accountRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    // ─── USERS ──────────────────────────────────────────────────────────────────

    public List<AdminUserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserDTO)
                .collect(Collectors.toList());
    }

    public AdminUserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        return mapToUserDTO(user);
    }

    /**
     * Updates user account status. Validates against UserStatus enum —
     * invalid values throw IllegalArgumentException → 400 Bad Request.
     */
    public AdminUserResponseDTO updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        UserStatus userStatus;
        try {
            userStatus = UserStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            String valid = Arrays.stream(UserStatus.values())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(
                    "Invalid user status: '" + status + "'. Valid values: " + valid);
        }

        user.setStatus(userStatus);
        return mapToUserDTO(userRepository.save(user));
    }

    // ─── KYC ────────────────────────────────────────────────────────────────────

    /**
     * Returns all users with KYC status PENDING (case-insensitive).
     */
    public List<AdminUserResponseDTO> getPendingKycUsers() {
        return userRepository.findAll().stream()
                .filter(u -> "PENDING".equalsIgnoreCase(u.getKycStatus()))
                .map(this::mapToUserDTO)
                .collect(Collectors.toList());
    }

    /**
     * Updates KYC status. Only PENDING, ACCEPTED, REJECTED are valid values.
     */
    public AdminUserResponseDTO updateKycStatus(Long userId, String kycStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        String normalized = kycStatus.toUpperCase();

        // ✅ FIX: APPROVED is sent by Angular admin UI → stored as VERIFIED
        if (normalized.equals("APPROVED")) {
            normalized = "VERIFIED";
        }

        if (!normalized.equals("PENDING")
                && !normalized.equals("VERIFIED")
                && !normalized.equals("REJECTED")) {
            throw new IllegalArgumentException(
                    "Invalid KYC status: '" + kycStatus + "'. Valid values: PENDING, APPROVED, VERIFIED, REJECTED");
        }

        user.setKycStatus(normalized);
        return mapToUserDTO(userRepository.save(user));
    }

    // ─── ACCOUNTS ───────────────────────────────────────────────────────────────

    public List<AdminAccountResponseDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToAccountDTO)
                .collect(Collectors.toList());
    }

    public List<AdminAccountResponseDTO> getAccountsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        return accountRepository.findByUser(user).stream()
                .map(this::mapToAccountDTO)
                .collect(Collectors.toList());
    }

    public AdminAccountResponseDTO updateAccountStatus(Long accountId, String status) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found."));

        AccountStatus accountStatus;
        try {
            accountStatus = AccountStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            String valid = Arrays.stream(AccountStatus.values())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(
                    "Invalid account status: '" + status + "'. Valid values: " + valid);
        }

        account.setStatus(accountStatus);
        return mapToAccountDTO(accountRepository.save(account));
    }

    // ─── TRANSACTIONS ────────────────────────────────────────────────────────────

    public List<AdminTransactionResponseDTO> getAllTransactions() {
        return transactionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToTransactionDTO)
                .collect(Collectors.toList());
    }

    // ─── MAPPERS ─────────────────────────────────────────────────────────────────

    private AdminUserResponseDTO mapToUserDTO(User user) {
        AdminUserResponseDTO dto = new AdminUserResponseDTO();
        dto.setId(user.getId());
        dto.setCustomerNo(user.getCustomerNo());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        // UserStatus is now an enum — call .name() to get the String value
        dto.setStatus(user.getStatus() != null ? user.getStatus().name() : null);
        dto.setKycStatus(user.getKycStatus());
        return dto;
    }

    private AdminAccountResponseDTO mapToAccountDTO(Account account) {
        AdminAccountResponseDTO dto = new AdminAccountResponseDTO();
        dto.setId(account.getId());
        dto.setAccountNo(account.getAccountNo());
        dto.setAccountType(account.getAccountType() != null ? account.getAccountType().name() : null);
        dto.setStatus(account.getStatus() != null ? account.getStatus().name() : null);
        dto.setCurrency(account.getCurrency());
        dto.setAvailableBalance(account.getAvailableBalance());
        dto.setLedgerBalance(account.getLedgerBalance());
        if (account.getUser() != null) {
            dto.setUserId(account.getUser().getId());
            dto.setCustomerNo(account.getUser().getCustomerNo());
            dto.setCustomerName(account.getUser().getFullName());
        }
        return dto;
    }

    private AdminTransactionResponseDTO mapToTransactionDTO(Transaction transaction) {
        AdminTransactionResponseDTO dto = new AdminTransactionResponseDTO();
        dto.setId(transaction.getId());
        dto.setTransactionRef(transaction.getTransactionRef());
        dto.setTransactionType(transaction.getTransactionType() != null
                ? transaction.getTransactionType().name() : null);
        dto.setTransactionStatus(transaction.getTransactionStatus() != null
                ? transaction.getTransactionStatus().name() : null);
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
    
    public void logAdminAction(Long adminId, String action, String resourceType, Long resourceId) {
        // Logs to application log — replace with audit_log table insert if required
        System.out.printf("[AUDIT] adminId=%d | action=%s | resource=%s | resourceId=%d | time=%s%n",
            adminId, action, resourceType, resourceId,
            java.time.Instant.now().toString());
    }
    
    
}