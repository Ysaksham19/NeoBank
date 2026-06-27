package com.neobank360app.service;

import com.neobank360app.dto.AdminDashboardDTO;
import com.neobank360app.dto.PendingApprovalDTO;
import com.neobank360app.dto.UserActivityDTO;
import com.neobank360app.entity.LoanApplicationStatus;
import com.neobank360app.entity.UserStatus;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.AccountRepository;
import com.neobank360app.repository.LoanApplicationRepository;
import com.neobank360app.repository.TransactionRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    private final UserRepository            userRepository;
    private final AccountRepository         accountRepository;
    private final TransactionRepository     transactionRepository;
    private final LoanApplicationRepository loanRepository;
    private final JdbcTemplate              jdbcTemplate;

    private final long startTime = System.currentTimeMillis();

    public AdminDashboardService(
            UserRepository userRepository,
            AccountRepository accountRepository,
            TransactionRepository transactionRepository,
            LoanApplicationRepository loanRepository,
            JdbcTemplate jdbcTemplate) {
        this.userRepository        = userRepository;
        this.accountRepository     = accountRepository;
        this.transactionRepository = transactionRepository;
        this.loanRepository        = loanRepository;
        this.jdbcTemplate          = jdbcTemplate;
    }

    // ── GET /api/admin/dashboard ──────────────────────────────────
    @Transactional(readOnly = true)
    public AdminDashboardDTO buildDashboard() {
        long totalUsers        = userRepository.count();
        long totalActiveUsers  = userRepository.countByStatus(UserStatus.ACTIVE);
        long totalLoans        = loanRepository.count();
        long pendingApprovals  = loanRepository
                .findByStatus(LoanApplicationStatus.PENDING).size();
        long totalTransactions = transactionRepository.count();

        Double totalIncome  = transactionRepository.sumCreditFromActiveAccounts();
        Double totalExpense = transactionRepository.sumDebitFromActiveAccounts();
        double savingsRate  = 0.0;
        if (totalIncome != null && totalIncome > 0) {
            double expense = (totalExpense != null) ? totalExpense : 0.0;
            savingsRate = ((totalIncome - expense) / totalIncome) * 100.0;
            savingsRate = Math.round(savingsRate * 100.0) / 100.0;
        }

        AdminDashboardDTO dto = new AdminDashboardDTO();
        dto.setTotalUsers(totalUsers);
        dto.setTotalActiveUsers(totalActiveUsers);
        dto.setTotalLoans(totalLoans);
        dto.setPendingApprovals(pendingApprovals);
        dto.setTotalTransactions(totalTransactions);
        dto.setPlatformSavingsRate(savingsRate);
        return dto;
    }

    // ── GET /api/admin/pending-approvals ──────────────────────────
    @Transactional(readOnly = true)
    public List<PendingApprovalDTO> getPendingApprovals() {
        return loanRepository
                .findByStatus(LoanApplicationStatus.PENDING)
                .stream()
                .map(loan -> {
                    PendingApprovalDTO dto = new PendingApprovalDTO();
                    dto.setId(loan.getId());
                    dto.setType("LOAN_APPLICATION");
                    dto.setApplicantName(loan.getUser() != null
                            ? loan.getUser().getFullName() : "Unknown");
                    dto.setProductName(loan.getLoanProduct() != null
                            ? loan.getLoanProduct().getProductName() : "N/A");
                    dto.setRequestedAmount(loan.getRequestedAmount());
                    dto.setAppliedAt(loan.getAppliedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ── GET /api/admin/system-health ──────────────────────────────
    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            health.put("dbStatus", "UP");
        } catch (Exception e) {
            health.put("dbStatus", "DOWN");
        }
        health.put("serverUptimeSeconds",
                (System.currentTimeMillis() - startTime) / 1000);
        health.put("timestamp", Instant.now().toString());
        return health;
    }

    // ── GET /api/admin/users/{userId}/activity ────────────────────
    @Transactional(readOnly = true)
    public UserActivityDTO getUserActivity(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + userId));

        List<UserActivityDTO.RecentTransaction> recentTxns =
                transactionRepository
                        .findTop20ByAccount_User_IdOrderByCreatedAtDesc(userId)
                        .stream()
                        .map(t -> new UserActivityDTO.RecentTransaction(
                                t.getTransactionRef(),
                                t.getTransactionType() != null
                                        ? t.getTransactionType().name() : "",
                                t.getAmount(),
                                t.getCreatedAt(),
                                t.getRemarks()
                        ))
                        .collect(Collectors.toList());

        UserActivityDTO dto = new UserActivityDTO();
        dto.setUserId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRecentTransactions(recentTxns);
        return dto;
    }

    // ── Audit log (BR-04) ─────────────────────────────────────────
    public void logAdminAction(Long adminId, String action,
                               String resourceType, Long resourceId) {
        System.out.printf(
                "[AUDIT] adminId=%d | action=%s | resource=%s | resourceId=%d | time=%s%n",
                adminId, action, resourceType, resourceId, Instant.now());
    }

    // ── Toggle user status (PATCH /api/admin/users/{userId}/status) ─
    public void updateUserStatus(Long userId, Long actingAdminId, boolean activate) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found: " + userId));
        user.setStatus(activate ? UserStatus.ACTIVE : UserStatus.INACTIVE);
        userRepository.save(user);
        logAdminAction(actingAdminId,
                activate ? "ACTIVATE_USER" : "DEACTIVATE_USER",
                "USER", userId);
    }
}