package com.neobank360app.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PendingApprovalDTO {

    private Long id;
    private String type;              // "LOAN_APPLICATION"
    private String applicantName;
    private String productName;
    private BigDecimal requestedAmount;
    private LocalDateTime appliedAt;

    public PendingApprovalDTO() {}

    public PendingApprovalDTO(Long id, String type, String applicantName,
                               String productName, BigDecimal requestedAmount,
                               LocalDateTime appliedAt) {
        this.id              = id;
        this.type            = type;
        this.applicantName   = applicantName;
        this.productName     = productName;
        this.requestedAmount = requestedAmount;
        this.appliedAt       = appliedAt;
    }

    public Long getId()                              { return id; }
    public void setId(Long v)                        { this.id = v; }

    public String getType()                          { return type; }
    public void setType(String v)                    { this.type = v; }

    public String getApplicantName()                 { return applicantName; }
    public void setApplicantName(String v)           { this.applicantName = v; }

    public String getProductName()                   { return productName; }
    public void setProductName(String v)             { this.productName = v; }

    public BigDecimal getRequestedAmount()           { return requestedAmount; }
    public void setRequestedAmount(BigDecimal v)     { this.requestedAmount = v; }

    public LocalDateTime getAppliedAt()              { return appliedAt; }
    public void setAppliedAt(LocalDateTime v)        { this.appliedAt = v; }
}