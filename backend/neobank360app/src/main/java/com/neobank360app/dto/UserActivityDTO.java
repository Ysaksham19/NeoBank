package com.neobank360app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class UserActivityDTO {

    private Long userId;
    private String fullName;
    private String email;
    private List<RecentTransaction> recentTransactions;

    public UserActivityDTO() {}

    public Long getUserId()                                        { return userId; }
    public void setUserId(Long v)                                  { this.userId = v; }

    public String getFullName()                                    { return fullName; }
    public void setFullName(String v)                              { this.fullName = v; }

    public String getEmail()                                       { return email; }
    public void setEmail(String v)                                 { this.email = v; }

    public List<RecentTransaction> getRecentTransactions()         { return recentTransactions; }
    public void setRecentTransactions(List<RecentTransaction> v)   { this.recentTransactions = v; }

    // ── Inner class ──────────────────────────────────────────────
    public static class RecentTransaction {
        private String transactionRef;
        private String transactionType;
        private BigDecimal amount;
        private LocalDateTime createdAt;
        private String remarks;

        public RecentTransaction() {}

        public RecentTransaction(String transactionRef, String transactionType,
                                  BigDecimal amount, LocalDateTime createdAt, String remarks) {
            this.transactionRef  = transactionRef;
            this.transactionType = transactionType;
            this.amount          = amount;
            this.createdAt       = createdAt;
            this.remarks         = remarks;
        }

        public String getTransactionRef()               { return transactionRef; }
        public void setTransactionRef(String v)         { this.transactionRef = v; }

        public String getTransactionType()              { return transactionType; }
        public void setTransactionType(String v)        { this.transactionType = v; }

        public BigDecimal getAmount()                   { return amount; }
        public void setAmount(BigDecimal v)             { this.amount = v; }

        public LocalDateTime getCreatedAt()             { return createdAt; }
        public void setCreatedAt(LocalDateTime v)       { this.createdAt = v; }

        public String getRemarks()                      { return remarks; }
        public void setRemarks(String v)                { this.remarks = v; }
    }
}