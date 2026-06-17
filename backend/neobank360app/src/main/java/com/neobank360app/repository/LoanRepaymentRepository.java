package com.neobank360app.repository;

import com.neobank360app.entity.LoanRepayment;
import com.neobank360app.entity.RepaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepaymentRepository extends JpaRepository<LoanRepayment, Long> {

    List<LoanRepayment> findByLoanAccountIdOrderByInstalmentNumberAsc(
            Long loanAccountId
    );

    List<LoanRepayment> findByLoanAccountIdAndPaymentStatusOrderByInstalmentNumberAsc(
            Long loanAccountId,
            RepaymentStatus paymentStatus
    );
}