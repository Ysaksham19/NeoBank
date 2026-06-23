package com.neobank360app.service;

import com.neobank360app.dto.LoanAccountDTO;
import com.neobank360app.dto.RepaymentScheduleDTO;
import com.neobank360app.entity.*;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanRepaymentService {

    private static final BigDecimal LATE_FEE = BigDecimal.valueOf(500);

    private final LoanAccountRepository loanAccountRepository;
    private final LoanRepaymentRepository loanRepaymentRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public LoanRepaymentService(
            LoanAccountRepository loanAccountRepository,
            LoanRepaymentRepository loanRepaymentRepository,
            UserRepository userRepository,
            AccountRepository accountRepository) {
        this.loanAccountRepository = loanAccountRepository;
        this.loanRepaymentRepository = loanRepaymentRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
    }

    // ─── MY LOAN ACCOUNTS ────────────────────────────────

    public List<LoanAccountDTO> getMyLoanAccounts() {
        User user = getAuthenticatedUser();
        return loanAccountRepository.findByUserId(user.getId())
                .stream().map(this::mapToLoanAccountDTO).collect(Collectors.toList());
    }

    // ─── REPAYMENT SCHEDULE ───────────────────────────────

    public List<RepaymentScheduleDTO> getRepaymentSchedule(Long loanAccountId) {
        User user = getAuthenticatedUser();

        LoanAccount loanAccount = loanAccountRepository.findById(loanAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan account not found"));

        if (!loanAccount.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        updateOverdueStatuses(loanAccountId);

        return loanRepaymentRepository
                .findByLoanAccountIdOrderByInstalmentNumberAsc(loanAccountId)
                .stream().map(this::mapToRepaymentDTO).collect(Collectors.toList());
    }

    // ─── PAY EMI ─────────────────────────────────────────

    @Transactional
    public String markAsPaid(Long loanAccountId, Long repaymentId) {

        User user = getAuthenticatedUser();

        LoanAccount loanAccount = loanAccountRepository.findById(loanAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan account not found"));

        if (!loanAccount.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        if (loanAccount.getStatus() == LoanAccountStatus.CLOSED) {
            throw new RuntimeException("Loan is already closed");
        }

        LoanRepayment repayment = loanRepaymentRepository.findById(repaymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Repayment not found"));

        if (repayment.getPaymentStatus() == RepaymentStatus.PAID) {
            throw new RuntimeException("This instalment is already paid");
        }

        // ✅ Apply late fee if OVERDUE
        BigDecimal totalPayable = repayment.getEmiAmount();
        if (repayment.getPaymentStatus() == RepaymentStatus.OVERDUE) {
            repayment.setLateFee(LATE_FEE);
            totalPayable = totalPayable.add(LATE_FEE);
        }

        // ✅ Deduct from user's account — both balances
        Account userAccount = accountRepository
                .findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User account not found"));

        if (userAccount.getAvailableBalance().compareTo(totalPayable) < 0) {
            throw new RuntimeException("Insufficient balance to pay EMI");
        }

        userAccount.setAvailableBalance(userAccount.getAvailableBalance().subtract(totalPayable));
        userAccount.setLedgerBalance(userAccount.getLedgerBalance().subtract(totalPayable));
        accountRepository.save(userAccount);

        // ✅ Reduce outstanding balance on loan account
        loanAccount.setOutstandingBalance(
                loanAccount.getOutstandingBalance().subtract(repayment.getPrincipalComponent()));

        repayment.setPaymentStatus(RepaymentStatus.PAID);
        repayment.setPaidAt(LocalDateTime.now());
        loanRepaymentRepository.save(repayment);

        // ✅ Auto-close loan if all instalments are PAID
        boolean allPaid = loanRepaymentRepository
                .findByLoanAccountIdOrderByInstalmentNumberAsc(loanAccountId)
                .stream()
                .allMatch(r -> r.getPaymentStatus() == RepaymentStatus.PAID);

        if (allPaid) {
            loanAccount.setStatus(LoanAccountStatus.CLOSED);
            loanAccount.setClosedAt(LocalDateTime.now());
            loanAccountRepository.save(loanAccount);
            return "EMI paid. Congratulations — your loan is now fully repaid!";
        }

        loanAccountRepository.save(loanAccount);
        return "EMI paid successfully";
    }

    // ─── OVERDUE UPDATER ─────────────────────────────────

    private void updateOverdueStatuses(Long loanAccountId) {
        loanRepaymentRepository
                .findByLoanAccountIdOrderByInstalmentNumberAsc(loanAccountId)
                .forEach(r -> {
                    if (r.getPaymentStatus() == RepaymentStatus.PENDING
                            && r.getDueDate().isBefore(LocalDate.now())) {
                        r.setPaymentStatus(RepaymentStatus.OVERDUE);
                        r.setLateFee(LATE_FEE);
                        loanRepaymentRepository.save(r);
                    }
                });
    }

    // ─── MAPPERS ─────────────────────────────────────────

    private LoanAccountDTO mapToLoanAccountDTO(LoanAccount a) {
        LoanAccountDTO dto = new LoanAccountDTO();
        dto.setLoanAccountId(a.getId());
        dto.setProductName(a.getLoanApplication().getLoanProduct().getProductName());
        dto.setPrincipalAmount(a.getPrincipalAmount());
        dto.setOutstandingBalance(a.getOutstandingBalance());
        dto.setAnnualInterestRate(a.getAnnualInterestRate());
        dto.setTenureMonths(a.getTenureMonths());
        dto.setEmiAmount(a.getEmiAmount());
        dto.setStatus(a.getStatus().name());
        dto.setDisbursedAt(a.getDisbursedAt());
        dto.setClosedAt(a.getClosedAt());
        return dto;
    }

    private RepaymentScheduleDTO mapToRepaymentDTO(LoanRepayment r) {
        RepaymentScheduleDTO dto = new RepaymentScheduleDTO();
        dto.setRepaymentId(r.getId());
        dto.setInstalmentNumber(r.getInstalmentNumber());
        dto.setDueDate(r.getDueDate());
        dto.setEmiAmount(r.getEmiAmount());
        dto.setPrincipalComponent(r.getPrincipalComponent());
        dto.setInterestComponent(r.getInterestComponent());
        dto.setClosingBalance(r.getClosingBalance());
        dto.setLateFee(r.getLateFee() != null ? r.getLateFee() : BigDecimal.ZERO);
        dto.setPaymentStatus(r.getPaymentStatus().name());
        dto.setPaidAt(r.getPaidAt());
        return dto;
    }

    // ─── AUTH HELPER ──────────────────────────────────────

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}