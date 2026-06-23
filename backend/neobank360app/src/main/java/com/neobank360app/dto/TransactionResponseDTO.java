package com.neobank360app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponseDTO {

    private Long id;
    private String transactionRef;
    private String transactionType;
    private String transactionStatus;
    private BigDecimal amount;
    private BigDecimal availableBalanceAfter;
    private BigDecimal ledgerBalanceAfter;
    private String remarks;
    private LocalDateTime createdAt;

    // sender account (flat — no nesting, no circular reference)
    private Long accountId;
    private String accountNo;

    // receiver account (TRANSFER only, null otherwise)
    private Long receiverAccountId;
    private String receiverAccountNo;

    public TransactionResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionRef() { return transactionRef; }
    public void setTransactionRef(String transactionRef) { this.transactionRef = transactionRef; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getTransactionStatus() { return transactionStatus; }
    public void setTransactionStatus(String transactionStatus) { this.transactionStatus = transactionStatus; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getAvailableBalanceAfter() { return availableBalanceAfter; }
    public void setAvailableBalanceAfter(BigDecimal availableBalanceAfter) { this.availableBalanceAfter = availableBalanceAfter; }

    public BigDecimal getLedgerBalanceAfter() { return ledgerBalanceAfter; }
    public void setLedgerBalanceAfter(BigDecimal ledgerBalanceAfter) { this.ledgerBalanceAfter = ledgerBalanceAfter; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getAccountId() { return accountId; }
    public void setAccountId(Long accountId) { this.accountId = accountId; }

    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }

    public Long getReceiverAccountId() { return receiverAccountId; }
    public void setReceiverAccountId(Long receiverAccountId) { this.receiverAccountId = receiverAccountId; }

    public String getReceiverAccountNo() { return receiverAccountNo; }
    public void setReceiverAccountNo(String receiverAccountNo) { this.receiverAccountNo = receiverAccountNo; }
}