package com.neobank360app.dto;

public class LoanDecisionDTO {

    private String decision;

    private String adminRemarks;

    public LoanDecisionDTO() {
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }
}