package com.neobank360app.repository;

import com.neobank360app.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InsightsRepository extends JpaRepository<Transaction, Long> {

    // ── Total CREDIT for active accounts only ─────────────────────────────
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "JOIN t.account a " +
           "WHERE a.user.id = :userId " +
           "AND t.transactionType = com.neobank360app.entity.TransactionType.CREDIT " +
           "AND a.status = com.neobank360app.entity.AccountStatus.ACTIVE")
    BigDecimal getTotalIncome(@Param("userId") Long userId);

    // ── Total DEBIT for active accounts only ──────────────────────────────
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "JOIN t.account a " +
           "WHERE a.user.id = :userId " +
           "AND t.transactionType = com.neobank360app.entity.TransactionType.DEBIT " +
           "AND a.status = com.neobank360app.entity.AccountStatus.ACTIVE")
    BigDecimal getTotalExpense(@Param("userId") Long userId);

    // ── Monthly trend — raw rows: [year, month, CREDIT/DEBIT, sum] ────────
    @Query("SELECT YEAR(t.createdAt), MONTH(t.createdAt), t.transactionType, SUM(t.amount) " +
           "FROM Transaction t " +
           "JOIN t.account a " +
           "WHERE a.user.id = :userId " +
           "AND a.status = com.neobank360app.entity.AccountStatus.ACTIVE " +
           "AND t.createdAt >= :since " +
           "GROUP BY YEAR(t.createdAt), MONTH(t.createdAt), t.transactionType " +
           "ORDER BY YEAR(t.createdAt) ASC, MONTH(t.createdAt) ASC")
    List<Object[]> getRawTrendData(@Param("userId") Long userId,
                                   @Param("since") LocalDateTime since);

    // ── Last 20 transactions for a user (admin activity view) ─────────────
    @Query("SELECT t FROM Transaction t " +
           "JOIN t.account a " +
           "WHERE a.user.id = :userId " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findTop20ByUserId(@Param("userId") Long userId,
                                         org.springframework.data.domain.Pageable pageable);
}