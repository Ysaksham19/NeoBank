package com.neobank360app.repository;

import com.neobank360app.entity.Account;
import com.neobank360app.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccountOrderByCreatedAtDesc(
            Account account
    );

    List<Transaction> findTop10ByAccountOrderByCreatedAtDesc(
            Account account
    );

    Optional<Transaction> findByTransactionRef(
            String transactionRef
    );

    Page<Transaction> findByAccount(
            Account account,
            Pageable pageable
    );

    List<Transaction> findByAccountUserId(Long userId);

    @EntityGraph(attributePaths = {
            "account",
            "account.user",
            "receiverAccount"
    })
    List<Transaction> findAllByOrderByCreatedAtDesc();
}