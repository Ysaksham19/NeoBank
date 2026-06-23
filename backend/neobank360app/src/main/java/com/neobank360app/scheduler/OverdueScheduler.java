package com.neobank360app.scheduler;

import com.neobank360app.entity.LoanRepayment;
import com.neobank360app.entity.RepaymentStatus;
import com.neobank360app.repository.LoanRepaymentRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class OverdueScheduler {

    private static final BigDecimal LATE_FEE = BigDecimal.valueOf(500);

    private final LoanRepaymentRepository loanRepaymentRepository;

    public OverdueScheduler(LoanRepaymentRepository loanRepaymentRepository) {
        this.loanRepaymentRepository = loanRepaymentRepository;
    }

    // Runs every day at 1:00 AM
    @Scheduled(cron = "0 0 1 * * *")
    public void markOverdueRepayments() {

        List<LoanRepayment> pendingRepayments =
                loanRepaymentRepository.findByPaymentStatus(RepaymentStatus.PENDING);

        for (LoanRepayment repayment : pendingRepayments) {

            if (repayment.getDueDate().isBefore(LocalDate.now())) {
                repayment.setPaymentStatus(RepaymentStatus.OVERDUE);
                repayment.setLateFee(LATE_FEE);
                loanRepaymentRepository.save(repayment);
            }
        }
    }
}