package com.neobank360app.repository;

import com.neobank360app.entity.LoanApplication;
import com.neobank360app.entity.LoanApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AdminDashboardRepository extends JpaRepository<LoanApplication, Long> {

    // ── User counts ───────────────────────────────────────────────────────
    @Query("SELECT COUNT(u) FROM User u")
    long countTotalUsers();

    @Query("SELECT COUNT(u) FROM User u WHERE u.status = com.neobank360app.entity.UserStatus.ACTIVE")
    long countActiveUsers();

    // ── Loan counts ───────────────────────────────────────────────────────
    @Query("SELECT COUNT(la) FROM LoanApplication la")
    long countTotalLoans();

    @Query("SELECT COUNT(la) FROM LoanApplication la WHERE la.status = com.neobank360app.entity.LoanApplicationStatus.PENDING")
    long countPendingLoans();

    // ── Transaction count ─────────────────────────────────────────────────
    @Query("SELECT COUNT(t) FROM Transaction t")
    long countTotalTransactions();

    // ── Platform savings rate numerics ────────────────────────────────────
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "JOIN t.account a " +
           "WHERE t.transactionType = com.neobank360app.entity.TransactionType.CREDIT " +
           "AND a.status = com.neobank360app.entity.AccountStatus.ACTIVE")
    BigDecimal sumPlatformIncome();

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "JOIN t.account a " +
           "WHERE t.transactionType = com.neobank360app.entity.TransactionType.DEBIT " +
           "AND a.status = com.neobank360app.entity.AccountStatus.ACTIVE")
    BigDecimal sumPlatformExpense();

    // ── Pending approvals detail list ─────────────────────────────────────
    @Query("SELECT la FROM LoanApplication la " +
           "JOIN FETCH la.user " +
           "JOIN FETCH la.loanProduct " +
           "WHERE la.status = com.neobank360app.entity.LoanApplicationStatus.PENDING " +
           "ORDER BY la.appliedAt ASC")
    List<LoanApplication> findPendingApprovals();
}