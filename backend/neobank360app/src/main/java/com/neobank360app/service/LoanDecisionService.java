package com.neobank360app.service;

import com.neobank360app.dto.LoanDecisionDTO;
import com.neobank360app.entity.*;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.*;
import com.neobank360app.util.EmiCalculatorUtil;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class LoanDecisionService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanAccountRepository loanAccountRepository;
    private final LoanRepaymentRepository loanRepaymentRepository;
    private final AccountRepository accountRepository;

    public LoanDecisionService(
            LoanApplicationRepository loanApplicationRepository,
            LoanAccountRepository loanAccountRepository,
            LoanRepaymentRepository loanRepaymentRepository,
            AccountRepository accountRepository) {
        this.loanApplicationRepository = loanApplicationRepository;
        this.loanAccountRepository = loanAccountRepository;
        this.loanRepaymentRepository = loanRepaymentRepository;
        this.accountRepository = accountRepository;
    }

    @Transactional
    public String decideLoan(Long loanApplicationId, LoanDecisionDTO dto) {

        LoanApplication application = loanApplicationRepository.findById(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan application not found"));

        if (application.getStatus() != LoanApplicationStatus.PENDING) {
            throw new RuntimeException("Application already processed");
        }

        if ("REJECTED".equalsIgnoreCase(dto.getDecision())) {
            application.setStatus(LoanApplicationStatus.REJECTED);
            application.setAdminRemarks(dto.getAdminRemarks());
            application.setDecidedAt(LocalDateTime.now());
            loanApplicationRepository.save(application);
            return "Loan application rejected";
        }

        if ("APPROVED".equalsIgnoreCase(dto.getDecision())) {
            application.setStatus(LoanApplicationStatus.APPROVED);
            application.setAdminRemarks(dto.getAdminRemarks());
            application.setDecidedAt(LocalDateTime.now());
            loanApplicationRepository.save(application);

            BigDecimal emi = EmiCalculatorUtil.calculateEMI(
                    application.getRequestedAmount(),
                    application.getLoanProduct().getAnnualInterestRate(),
                    application.getRequestedTenureMonths());

            // ✅ Credit loan amount to user's account
            Account userAccount = accountRepository
                    .findByUserId(application.getUser().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User account not found"));

            BigDecimal credited = application.getRequestedAmount();
            userAccount.setAvailableBalance(userAccount.getAvailableBalance().add(credited));
            userAccount.setLedgerBalance(userAccount.getLedgerBalance().add(credited));
            accountRepository.save(userAccount);

            // ✅ Create loan account
            LoanAccount loanAccount = new LoanAccount();
            loanAccount.setLoanApplication(application);
            loanAccount.setUser(application.getUser());
            loanAccount.setPrincipalAmount(application.getRequestedAmount());
            loanAccount.setOutstandingBalance(application.getRequestedAmount());
            loanAccount.setAnnualInterestRate(application.getLoanProduct().getAnnualInterestRate());
            loanAccount.setTenureMonths(application.getRequestedTenureMonths());
            loanAccount.setEmiAmount(emi);
            loanAccount.setStatus(LoanAccountStatus.ACTIVE);

            LoanAccount savedLoanAccount = loanAccountRepository.save(loanAccount);
            generateRepaymentSchedule(savedLoanAccount);

            return "Loan application approved and amount credited to account";
        }

        throw new RuntimeException("Invalid decision. Use APPROVED or REJECTED.");
    }

    private void generateRepaymentSchedule(LoanAccount loanAccount) {

        BigDecimal outstandingPrincipal = loanAccount.getPrincipalAmount();
        BigDecimal annualRate = loanAccount.getAnnualInterestRate();
        int tenure = loanAccount.getTenureMonths();
        BigDecimal emi = loanAccount.getEmiAmount();

        BigDecimal monthlyRate = annualRate.divide(
                BigDecimal.valueOf(12 * 100), 10, RoundingMode.HALF_UP);

        for (int i = 1; i <= tenure; i++) {

            BigDecimal interestComponent = outstandingPrincipal.multiply(monthlyRate)
                    .setScale(2, RoundingMode.HALF_UP);

            BigDecimal principalComponent = emi.subtract(interestComponent)
                    .setScale(2, RoundingMode.HALF_UP);

            // Last instalment — clear rounding residual
            if (i == tenure) {
                principalComponent = outstandingPrincipal;
                emi = principalComponent.add(interestComponent);
            }

            outstandingPrincipal = outstandingPrincipal.subtract(principalComponent);

            LoanRepayment repayment = new LoanRepayment();
            repayment.setLoanAccount(loanAccount);
            repayment.setInstalmentNumber(i);
            repayment.setDueDate(LocalDate.now().plusMonths(i));
            repayment.setEmiAmount(emi);
            repayment.setPrincipalComponent(principalComponent);
            repayment.setInterestComponent(interestComponent);
            repayment.setClosingBalance(outstandingPrincipal.setScale(2, RoundingMode.HALF_UP));
            repayment.setLateFee(BigDecimal.ZERO);
            repayment.setPaymentStatus(RepaymentStatus.PENDING);

            loanRepaymentRepository.save(repayment);
        }
    }
}