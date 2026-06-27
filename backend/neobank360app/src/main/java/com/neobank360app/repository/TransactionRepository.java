package com.neobank360app.repository;

import com.neobank360app.entity.Account;
import com.neobank360app.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ── Non-paginated (kept for mini-statement / internal use) ──────────────
    List<Transaction> findByAccountOrderByCreatedAtDesc(Account account);

    List<Transaction> findTop10ByAccountOrderByCreatedAtDesc(Account account);

    Optional<Transaction> findByTransactionRef(String transactionRef);

    List<Transaction> findByAccountUserId(Long userId);

    List<Transaction> findTop20ByAccount_User_IdOrderByCreatedAtDesc(Long userId);

    // ── Paginated ────────────────────────────────────────────────────────────

    /**
     * Full paginated statement for one account.
     * Usage: PageRequest.of(page, size, Sort.by("createdAt").descending())
     */
    Page<Transaction> findByAccountOrderByCreatedAtDesc(Account account, Pageable pageable);

    /**
     * Admin: paginated view of ALL transactions across all accounts.
     */
    @EntityGraph(attributePaths = {"account", "account.user", "receiverAccount"})
    Page<Transaction> findAllByOrderByCreatedAtDesc(Pageable pageable);

    // ── Aggregate queries (Admin Dashboard) ─────────────────────────────────

    @Query("SELECT SUM(t.amount) FROM Transaction t JOIN t.account a " +
           "WHERE t.transactionType = 'CREDIT' AND a.status = 'ACTIVE'")
    Double sumCreditFromActiveAccounts();

    @Query("SELECT SUM(t.amount) FROM Transaction t JOIN t.account a " +
           "WHERE t.transactionType = 'DEBIT' AND a.status = 'ACTIVE'")
    Double sumDebitFromActiveAccounts();
}
