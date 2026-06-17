package com.neobank360app.service;

import com.neobank360app.dto.LoanAccountDTO;
import com.neobank360app.dto.RepaymentScheduleDTO;
import com.neobank360app.entity.LoanAccount;
import com.neobank360app.entity.LoanRepayment;
import com.neobank360app.entity.User;
import com.neobank360app.entity.RepaymentStatus;
import com.neobank360app.repository.LoanAccountRepository;
import com.neobank360app.repository.LoanRepaymentRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LoanRepaymentService {

    private final LoanAccountRepository loanAccountRepository;

    private final LoanRepaymentRepository loanRepaymentRepository;

    private final UserRepository userRepository;

    public LoanRepaymentService(
            LoanAccountRepository loanAccountRepository,
            LoanRepaymentRepository loanRepaymentRepository,
            UserRepository userRepository
    ) {
        this.loanAccountRepository = loanAccountRepository;
        this.loanRepaymentRepository = loanRepaymentRepository;
        this.userRepository = userRepository;
    }

    public List<LoanAccountDTO> getMyLoanAccounts() {

        User user = getAuthenticatedUser();

        List<LoanAccount> loanAccounts =
                loanAccountRepository.findByUserId(
                        user.getId()
                );

        List<LoanAccountDTO> response =
                new ArrayList<>();

        for (LoanAccount loanAccount : loanAccounts) {

            LoanAccountDTO dto =
                    new LoanAccountDTO();

            dto.setLoanAccountId(
                    loanAccount.getId()
            );

            dto.setProductName(
                    loanAccount.getLoanApplication()
                            .getLoanProduct()
                            .getProductName()
            );

            dto.setPrincipalAmount(
                    loanAccount.getPrincipalAmount()
            );

            dto.setAnnualInterestRate(
                    loanAccount.getAnnualInterestRate()
            );

            dto.setTenureMonths(
                    loanAccount.getTenureMonths()
            );

            dto.setEmiAmount(
                    loanAccount.getEmiAmount()
            );

            dto.setDisbursedAt(
                    loanAccount.getDisbursedAt()
            );

            response.add(dto);
        }

        return response;
    }

    public List<RepaymentScheduleDTO> getRepaymentSchedule(
            Long loanAccountId
    ) {

        User user = getAuthenticatedUser();

        LoanAccount loanAccount =
                loanAccountRepository.findById(
                                loanAccountId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Loan account not found"
                                ));

        if (!loanAccount.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Access denied"
            );
        }

        updateOverdueStatuses(loanAccountId);

        List<LoanRepayment> repayments =
                loanRepaymentRepository
                        .findByLoanAccountIdOrderByInstalmentNumberAsc(
                                loanAccountId
                        );

        List<RepaymentScheduleDTO> response =
                new ArrayList<>();

        for (LoanRepayment repayment : repayments) {

            RepaymentScheduleDTO dto =
                    new RepaymentScheduleDTO();

            dto.setInstalmentNumber(
                    repayment.getInstalmentNumber()
            );

            dto.setDueDate(
                    repayment.getDueDate()
            );

            dto.setEmiAmount(
                    repayment.getEmiAmount()
            );

            dto.setPrincipalComponent(
                    repayment.getPrincipalComponent()
            );

            dto.setInterestComponent(
                    repayment.getInterestComponent()
            );

            dto.setPaymentStatus(
                    repayment.getPaymentStatus().name()
            );

            response.add(dto);
        }

        return response;
    }

    public String markAsPaid(
            Long loanAccountId,
            Long repaymentId
    ) {

        User user = getAuthenticatedUser();

        LoanAccount loanAccount =
                loanAccountRepository.findById(
                                loanAccountId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Loan account not found"
                                ));

        if (!loanAccount.getUser().getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "Access denied"
            );
        }

        LoanRepayment repayment =
                loanRepaymentRepository.findById(
                                repaymentId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Repayment not found"
                                ));

        repayment.setPaymentStatus(
                RepaymentStatus.PAID
        );

        repayment.setPaidAt(
                LocalDateTime.now()
        );

        loanRepaymentRepository.save(repayment);

        return "Repayment marked as PAID";
    }

    private void updateOverdueStatuses(
            Long loanAccountId
    ) {

        List<LoanRepayment> repayments =
                loanRepaymentRepository
                        .findByLoanAccountIdOrderByInstalmentNumberAsc(
                                loanAccountId
                        );

        for (LoanRepayment repayment : repayments) {

            if (repayment.getPaymentStatus()
                    == RepaymentStatus.PENDING
                    &&
                    repayment.getDueDate()
                            .isBefore(LocalDate.now())) {

                repayment.setPaymentStatus(
                        RepaymentStatus.OVERDUE
                );

                loanRepaymentRepository.save(repayment);
            }
        }
    }

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));
    }
}