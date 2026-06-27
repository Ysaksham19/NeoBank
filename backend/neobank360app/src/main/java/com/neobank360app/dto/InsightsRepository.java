//package com.neobank360app.repository;
//
//import com.neobank360app.entity.Transaction;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Repository
//public interface InsightsRepository extends JpaRepository<Transaction, Long> {
//
//    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
//           "JOIN t.account a " +
//           "WHERE a.user.id = :userId AND t.type = 'CREDIT' AND a.isActive = true")
//    BigDecimal getTotalIncome(@Param("userId") Long userId);
//
//    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
//           "JOIN t.account a " +
//           "WHERE a.user.id = :userId AND t.type = 'DEBIT' AND a.isActive = true")
//    BigDecimal getTotalExpense(@Param("userId") Long userId);
//
//    @Query("SELECT YEAR(t.transactionDate), MONTH(t.transactionDate), " +
//           "SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE 0 END), " +
//           "SUM(CASE WHEN t.type = 'DEBIT'  THEN t.amount ELSE 0 END) " +
//           "FROM Transaction t JOIN t.account a " +
//           "WHERE a.user.id = :userId AND a.isActive = true " +
//           "AND t.transactionDate >= :from " +
//           "GROUP BY YEAR(t.transactionDate), MONTH(t.transactionDate) " +
//           "ORDER BY YEAR(t.transactionDate) DESC, MONTH(t.transactionDate) DESC")
//    List<Object[]> getTrendSummaryRaw(@Param("userId") Long userId,
//                                      @Param("from") LocalDateTime from);
//}