package com.neobank360app.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_accounts")
public class LoanAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_application_id", nullable = false, unique = true)
    private LoanApplication loanApplication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "principal_amount", nullable = false)
    private BigDecimal principalAmount;

    @Column(name = "outstanding_balance", nullable = false)  // ✅ NEW
    private BigDecimal outstandingBalance;

    @Column(name = "annual_interest_rate", nullable = false)
    private BigDecimal annualInterestRate;

    @Column(name = "tenure_months", nullable = false)
    private Integer tenureMonths;

    @Column(name = "emi_amount", nullable = false)
    private BigDecimal emiAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)               // ✅ NEW
    private LoanAccountStatus status;

    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;

    @Column(name = "closed_at")                              // ✅ NEW
    private LocalDateTime closedAt;

    public LoanAccount() {}

    @PrePersist
    public void prePersist() {
        this.disbursedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = LoanAccountStatus.ACTIVE;
        }
        // outstanding starts equal to principal on disbursement
        if (this.outstandingBalance == null) {
            this.outstandingBalance = this.principalAmount;
        }
    }

    public Long getId() { return id; }

    public LoanApplication getLoanApplication() { return loanApplication; }
    public void setLoanApplication(LoanApplication loanApplication) { this.loanApplication = loanApplication; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BigDecimal getPrincipalAmount() { return principalAmount; }
    public void setPrincipalAmount(BigDecimal principalAmount) { this.principalAmount = principalAmount; }

    public BigDecimal getOutstandingBalance() { return outstandingBalance; }
    public void setOutstandingBalance(BigDecimal outstandingBalance) { this.outstandingBalance = outstandingBalance; }

    public BigDecimal getAnnualInterestRate() { return annualInterestRate; }
    public void setAnnualInterestRate(BigDecimal annualInterestRate) { this.annualInterestRate = annualInterestRate; }

    public Integer getTenureMonths() { return tenureMonths; }
    public void setTenureMonths(Integer tenureMonths) { this.tenureMonths = tenureMonths; }

    public BigDecimal getEmiAmount() { return emiAmount; }
    public void setEmiAmount(BigDecimal emiAmount) { this.emiAmount = emiAmount; }

    public LoanAccountStatus getStatus() { return status; }
    public void setStatus(LoanAccountStatus status) { this.status = status; }

    public LocalDateTime getDisbursedAt() { return disbursedAt; }
    public void setDisbursedAt(LocalDateTime disbursedAt) { this.disbursedAt = disbursedAt; }

    public LocalDateTime getClosedAt() { return closedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }
}