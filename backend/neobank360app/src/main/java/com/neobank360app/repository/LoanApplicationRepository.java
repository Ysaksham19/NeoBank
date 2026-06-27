package com.neobank360app.repository;

import com.neobank360app.entity.LoanApplication;
import com.neobank360app.entity.LoanApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Long> {

    List<LoanApplication> findByUserId(Long userId);

    List<LoanApplication> findByStatus(LoanApplicationStatus status);

    Optional<LoanApplication> findByUserIdAndLoanProductIdAndStatus(
            Long userId,
            Long loanProductId,
            LoanApplicationStatus status
    );
    
//    List<LoanApplication> findByStatusOrderByAppliedAtAsc(String status);
}