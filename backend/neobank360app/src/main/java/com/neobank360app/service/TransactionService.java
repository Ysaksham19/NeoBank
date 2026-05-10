package com.neobank360app.service;

import com.neobank360app.dto.TransferRequestDTO;
import com.neobank360app.entity.*;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.exception.UnauthorizedAccountAccessException;
import com.neobank360app.repository.AccountRepository;
import com.neobank360app.repository.TransactionRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class TransactionService {

    private static final SecureRandom SECURE_RANDOM =
            new SecureRandom();

    private final TransactionRepository transactionRepository;

    private final AccountRepository accountRepository;

    private final UserRepository userRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            AccountRepository accountRepository,
            UserRepository userRepository
    ) {

        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.userRepository = userRepository;
    }

    // ───────────────── DEPOSIT MONEY ─────────────────

    @Transactional
    public Transaction deposit(
            Long accountId,
            BigDecimal amount,
            String remarks
    ) {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Amount must be greater than zero."
            );
        }

        Account account =
                getValidatedAccount(accountId);

        BigDecimal updatedAvailableBalance =
                account.getAvailableBalance()
                        .add(amount);

        BigDecimal updatedLedgerBalance =
                account.getLedgerBalance()
                        .add(amount);

        account.setAvailableBalance(
                updatedAvailableBalance
        );

        account.setLedgerBalance(
                updatedLedgerBalance
        );

        accountRepository.save(account);

        Transaction transaction =
                new Transaction();

        transaction.setTransactionRef(
                generateTransactionRef()
        );

        transaction.setAccount(account);

        transaction.setTransactionType(
                TransactionType.DEPOSIT
        );

        transaction.setTransactionStatus(
                TransactionStatus.SUCCESS
        );

        transaction.setAmount(amount);

        transaction.setAvailableBalanceAfter(
                updatedAvailableBalance
        );

        transaction.setLedgerBalanceAfter(
                updatedLedgerBalance
        );

        transaction.setRemarks(remarks);

        return transactionRepository.save(transaction);
    }

    // ───────────────── TRANSFER MONEY ─────────────────

    @Transactional
    public Transaction transferMoney(
            Long senderAccountId,
            TransferRequestDTO requestDTO
    ) {

        if (requestDTO.getAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Transfer amount must be greater than zero."
            );
        }

        Account senderAccount =
                getValidatedAccount(senderAccountId);

        Account receiverAccount =
                accountRepository.findByAccountNo(
                        requestDTO.getReceiverAccountNo()
                ).orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Receiver account not found."
                        ));

        if (senderAccount.getAccountNo()
                .equals(receiverAccount.getAccountNo())) {

            throw new IllegalArgumentException(
                    "Cannot transfer money to same account."
            );
        }

        if (senderAccount.getAvailableBalance()
                .compareTo(requestDTO.getAmount()) < 0) {

            throw new IllegalArgumentException(
                    "Insufficient balance."
            );
        }

        // ───── DEBIT SENDER ─────

        BigDecimal senderUpdatedBalance =
                senderAccount.getAvailableBalance()
                        .subtract(requestDTO.getAmount());

        senderAccount.setAvailableBalance(
                senderUpdatedBalance
        );

        senderAccount.setLedgerBalance(
                senderUpdatedBalance
        );

        accountRepository.save(senderAccount);

        // ───── CREDIT RECEIVER ─────

        BigDecimal receiverUpdatedBalance =
                receiverAccount.getAvailableBalance()
                        .add(requestDTO.getAmount());

        receiverAccount.setAvailableBalance(
                receiverUpdatedBalance
        );

        receiverAccount.setLedgerBalance(
                receiverUpdatedBalance
        );

        accountRepository.save(receiverAccount);

        // ───── CREATE TRANSACTION ─────

        Transaction transaction =
                new Transaction();

        transaction.setTransactionRef(
                generateTransactionRef()
        );

        transaction.setAccount(senderAccount);

        transaction.setReceiverAccount(
                receiverAccount
        );

        transaction.setTransactionType(
                TransactionType.TRANSFER
        );

        transaction.setTransactionStatus(
                TransactionStatus.SUCCESS
        );

        transaction.setAmount(
                requestDTO.getAmount()
        );

        transaction.setAvailableBalanceAfter(
                senderUpdatedBalance
        );

        transaction.setLedgerBalanceAfter(
                senderUpdatedBalance
        );

        transaction.setRemarks(
                requestDTO.getRemarks()
        );

        return transactionRepository.save(transaction);
    }

    // ───────────────── GET ACCOUNT TRANSACTIONS ─────────────────

    public List<Transaction> getAccountTransactions(
            Long accountId
    ) {

        Account account =
                getValidatedAccount(accountId);

        return transactionRepository
                .findByAccountOrderByCreatedAtDesc(
                        account
                );
    }

    // ───────────────── PRIVATE HELPERS ─────────────────

    private Account getValidatedAccount(
            Long accountId
    ) {

        User user =
                getAuthenticatedUser();

        Account account =
                accountRepository.findById(accountId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Account not found."
                                ));

        if (!account.getUser()
                .getId()
                .equals(user.getId())) {

            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to access this account."
            );
        }

        return account;
    }

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));
    }

    private String generateTransactionRef() {

        return "TXN" +
                (SECURE_RANDOM.nextInt(90000000)
                        + 10000000);
    }
    
    
 // ───────────────── WITHDRAW MONEY ─────────────────

    @Transactional
    public Transaction withdraw(
            Long accountId,
            BigDecimal amount,
            String remarks
    ) {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Amount must be greater than zero."
            );
        }

        Account account =
                getValidatedAccount(accountId);

        if (account.getAvailableBalance()
                .compareTo(amount) < 0) {

            throw new IllegalArgumentException(
                    "Insufficient balance."
            );
        }

        BigDecimal updatedBalance =
                account.getAvailableBalance()
                        .subtract(amount);

        account.setAvailableBalance(
                updatedBalance
        );

        account.setLedgerBalance(
                updatedBalance
        );

        accountRepository.save(account);

        Transaction transaction =
                new Transaction();

        transaction.setTransactionRef(
                generateTransactionRef()
        );

        transaction.setAccount(account);

        transaction.setTransactionType(
                TransactionType.DEBIT
        );

        transaction.setTransactionStatus(
                TransactionStatus.SUCCESS
        );

        transaction.setAmount(amount);

        transaction.setAvailableBalanceAfter(
                updatedBalance
        );

        transaction.setLedgerBalanceAfter(
                updatedBalance
        );

        transaction.setRemarks(remarks);

        return transactionRepository.save(transaction);
    }

    // ───────────────── MINI STATEMENT ─────────────────

    public List<Transaction> getMiniStatement(
            Long accountId
    ) {

        Account account =
                getValidatedAccount(accountId);

        return transactionRepository
                .findTop10ByAccountOrderByCreatedAtDesc(
                        account
                );
    }
    
    
 // ───────────────── PAGINATED TRANSACTIONS ─────────────────

    public Page<Transaction> getPaginatedTransactions(
            Long accountId,
            int page,
            int size
    ) {

        Account account =
                getValidatedAccount(accountId);

        Pageable pageable =
                PageRequest.of(page, size);

        return transactionRepository.findByAccount(
                account,
                pageable
        );
    }
}