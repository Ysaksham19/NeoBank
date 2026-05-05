package com.neobank360app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class AccountTypeSelectionRequest {

    @NotBlank(message = "Account type is required")
    @Pattern(regexp = "SAVINGS|CURRENT|SALARY",
             message = "Account type must be SAVINGS, CURRENT, or SALARY")
    private String accountType;

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
}