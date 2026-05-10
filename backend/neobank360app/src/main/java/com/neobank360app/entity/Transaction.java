package com.neobank360app.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_ref",
            nullable = false,
            unique = true,
            length = 50)
    private String transactionRef;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id",
            nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_account_id")
    private Account receiverAccount;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type",
            nullable = false,
            length = 30)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_status",
            nullable = false,
            length = 30)
    private TransactionStatus transactionStatus =
            TransactionStatus.SUCCESS;

    @Column(nullable = false,
            precision = 19,
            scale = 2)
    private BigDecimal amount;

    @Column(name = "available_balance_after",
            nullable = false,
            precision = 19,
            scale = 2)
    private BigDecimal availableBalanceAfter;

    @Column(name = "ledger_balance_after",
            nullable = false,
            precision = 19,
            scale = 2)
    private BigDecimal ledgerBalanceAfter;

    @Column(length = 255)
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at",
            updatable = false)
    private LocalDateTime createdAt;

    public Transaction() {
    }

    public Long getId() {
        return id;
    }

    public String getTransactionRef() {
        return transactionRef;
    }

    public void setTransactionRef(String transactionRef) {
        this.transactionRef = transactionRef;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Account getReceiverAccount() {
        return receiverAccount;
    }

    public void setReceiverAccount(Account receiverAccount) {
        this.receiverAccount = receiverAccount;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(
            TransactionType transactionType
    ) {
        this.transactionType = transactionType;
    }

    public TransactionStatus getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(
            TransactionStatus transactionStatus
    ) {
        this.transactionStatus = transactionStatus;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getAvailableBalanceAfter() {
        return availableBalanceAfter;
    }

    public void setAvailableBalanceAfter(
            BigDecimal availableBalanceAfter
    ) {
        this.availableBalanceAfter =
                availableBalanceAfter;
    }

    public BigDecimal getLedgerBalanceAfter() {
        return ledgerBalanceAfter;
    }

    public void setLedgerBalanceAfter(
            BigDecimal ledgerBalanceAfter
    ) {
        this.ledgerBalanceAfter =
                ledgerBalanceAfter;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}