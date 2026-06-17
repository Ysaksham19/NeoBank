package com.neobank360app.service;

import com.neobank360app.dto.LoanDecisionDTO;
import com.neobank360app.entity.LoanAccount;
import com.neobank360app.entity.LoanApplication;
import com.neobank360app.entity.LoanRepayment;
import com.neobank360app.entity.LoanApplicationStatus;
import com.neobank360app.entity.RepaymentStatus;
import com.neobank360app.repository.LoanAccountRepository;
import com.neobank360app.repository.LoanApplicationRepository;
import com.neobank360app.repository.LoanRepaymentRepository;
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

    public LoanDecisionService(
            LoanApplicationRepository loanApplicationRepository,
            LoanAccountRepository loanAccountRepository,
            LoanRepaymentRepository loanRepaymentRepository
    ) {
        this.loanApplicationRepository = loanApplicationRepository;
        this.loanAccountRepository = loanAccountRepository;
        this.loanRepaymentRepository = loanRepaymentRepository;
    }

    @Transactional
    public String decideLoan(
            Long loanApplicationId,
            LoanDecisionDTO dto
    ) {

        LoanApplication application =
                loanApplicationRepository.findById(
                                loanApplicationId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Loan application not found"
                                ));

        if (application.getStatus() !=
                LoanApplicationStatus.PENDING) {

            throw new RuntimeException(
                    "Application already processed"
            );
        }

        if ("REJECTED".equalsIgnoreCase(dto.getDecision())) {

            application.setStatus(
                    LoanApplicationStatus.REJECTED
            );

            application.setAdminRemarks(
                    dto.getAdminRemarks()
            );

            application.setDecidedAt(
                    LocalDateTime.now()
            );

            loanApplicationRepository.save(application);

            return "Loan application rejected";
        }

        if ("APPROVED".equalsIgnoreCase(dto.getDecision())) {

            application.setStatus(
                    LoanApplicationStatus.APPROVED
            );

            application.setAdminRemarks(
                    dto.getAdminRemarks()
            );

            application.setDecidedAt(
                    LocalDateTime.now()
            );

            loanApplicationRepository.save(application);

            BigDecimal emi =
                    EmiCalculatorUtil.calculateEMI(
                            application.getRequestedAmount(),
                            application.getLoanProduct()
                                    .getAnnualInterestRate(),
                            application.getRequestedTenureMonths()
                    );

            LoanAccount loanAccount =
                    new LoanAccount();

            loanAccount.setLoanApplication(application);

            loanAccount.setUser(
                    application.getUser()
            );

            loanAccount.setPrincipalAmount(
                    application.getRequestedAmount()
            );

            loanAccount.setAnnualInterestRate(
                    application.getLoanProduct()
                            .getAnnualInterestRate()
            );

            loanAccount.setTenureMonths(
                    application.getRequestedTenureMonths()
            );

            loanAccount.setEmiAmount(emi);

            LoanAccount savedLoanAccount =
                    loanAccountRepository.save(loanAccount);

            generateRepaymentSchedule(
                    savedLoanAccount
            );

            return "Loan application approved";
        }

        throw new RuntimeException(
                "Invalid decision"
        );
    }

    private void generateRepaymentSchedule(
            LoanAccount loanAccount
    ) {

        BigDecimal outstandingPrincipal =
                loanAccount.getPrincipalAmount();

        BigDecimal annualRate =
                loanAccount.getAnnualInterestRate();

        int tenure =
                loanAccount.getTenureMonths();

        BigDecimal emi =
                loanAccount.getEmiAmount();

        BigDecimal monthlyRate =
                annualRate.divide(
                        BigDecimal.valueOf(12 * 100),
                        10,
                        RoundingMode.HALF_UP
                );

        for (int i = 1; i <= tenure; i++) {

            BigDecimal interestComponent =
                    outstandingPrincipal.multiply(monthlyRate)
                            .setScale(2, RoundingMode.HALF_UP);

            BigDecimal principalComponent =
                    emi.subtract(interestComponent)
                            .setScale(2, RoundingMode.HALF_UP);

            if (i == tenure) {

                principalComponent =
                        outstandingPrincipal;

                emi =
                        principalComponent.add(
                                interestComponent
                        );
            }

            outstandingPrincipal =
                    outstandingPrincipal.subtract(
                            principalComponent
                    );

            LoanRepayment repayment =
                    new LoanRepayment();

            repayment.setLoanAccount(
                    loanAccount
            );

            repayment.setInstalmentNumber(i);

            repayment.setDueDate(
                    LocalDate.now().plusMonths(i)
            );

            repayment.setEmiAmount(emi);

            repayment.setPrincipalComponent(
                    principalComponent
            );

            repayment.setInterestComponent(
                    interestComponent
            );

            repayment.setPaymentStatus(
                    RepaymentStatus.PENDING
            );

            loanRepaymentRepository.save(repayment);
        }
    }
}