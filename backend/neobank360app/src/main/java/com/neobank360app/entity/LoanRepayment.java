package com.neobank360app.entity;

import com.neobank360app.entity.RepaymentStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_repayments")
public class LoanRepayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_account_id", nullable = false)
    private LoanAccount loanAccount;

    @Column(name = "instalment_number", nullable = false)
    private Integer instalmentNumber;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "emi_amount", nullable = false)
    private BigDecimal emiAmount;

    @Column(name = "principal_component", nullable = false)
    private BigDecimal principalComponent;

    @Column(name = "interest_component", nullable = false)
    private BigDecimal interestComponent;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private RepaymentStatus paymentStatus;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    public LoanRepayment() {
    }

    @PrePersist
    public void prePersist() {

        if (paymentStatus == null) {
            paymentStatus = RepaymentStatus.PENDING;
        }
    }

    public Long getId() {
        return id;
    }

    public LoanAccount getLoanAccount() {
        return loanAccount;
    }

    public void setLoanAccount(LoanAccount loanAccount) {
        this.loanAccount = loanAccount;
    }

    public Integer getInstalmentNumber() {
        return instalmentNumber;
    }

    public void setInstalmentNumber(Integer instalmentNumber) {
        this.instalmentNumber = instalmentNumber;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public BigDecimal getEmiAmount() {
        return emiAmount;
    }

    public void setEmiAmount(BigDecimal emiAmount) {
        this.emiAmount = emiAmount;
    }

    public BigDecimal getPrincipalComponent() {
        return principalComponent;
    }

    public void setPrincipalComponent(BigDecimal principalComponent) {
        this.principalComponent = principalComponent;
    }

    public BigDecimal getInterestComponent() {
        return interestComponent;
    }

    public void setInterestComponent(BigDecimal interestComponent) {
        this.interestComponent = interestComponent;
    }

    public RepaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(RepaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }
}