package com.neobank360app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AdminTransactionResponseDTO {

    private Long id;
    private String transactionRef;
    private String customerNo;
    private String customerName;
    private String senderAccountNo;
    private String receiverAccountNo;
    private String transactionType;
    private String transactionStatus;
    private BigDecimal amount;
    private BigDecimal availableBalanceAfter;
    private BigDecimal ledgerBalanceAfter;
    private String remarks;
    private LocalDateTime createdAt;

    public AdminTransactionResponseDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionRef() {
        return transactionRef;
    }

    public void setTransactionRef(String transactionRef) {
        this.transactionRef = transactionRef;
    }

    public String getCustomerNo() {
        return customerNo;
    }

    public void setCustomerNo(String customerNo) {
        this.customerNo = customerNo;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getSenderAccountNo() {
        return senderAccountNo;
    }

    public void setSenderAccountNo(String senderAccountNo) {
        this.senderAccountNo = senderAccountNo;
    }

    public String getReceiverAccountNo() {
        return receiverAccountNo;
    }

    public void setReceiverAccountNo(String receiverAccountNo) {
        this.receiverAccountNo = receiverAccountNo;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
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

    public void setAvailableBalanceAfter(BigDecimal availableBalanceAfter) {
        this.availableBalanceAfter = availableBalanceAfter;
    }

    public BigDecimal getLedgerBalanceAfter() {
        return ledgerBalanceAfter;
    }

    public void setLedgerBalanceAfter(BigDecimal ledgerBalanceAfter) {
        this.ledgerBalanceAfter = ledgerBalanceAfter;
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}