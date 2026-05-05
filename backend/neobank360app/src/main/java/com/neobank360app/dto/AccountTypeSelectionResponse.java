package com.neobank360app.dto;

import java.math.BigDecimal;

public class AccountTypeSelectionResponse {
    private String accountType;
    private BigDecimal minimumBalance;
    private String description;
    private String message;

    public AccountTypeSelectionResponse(String accountType, BigDecimal minimumBalance,
                                        String description, String message) {
        this.accountType = accountType;
        this.minimumBalance = minimumBalance;
        this.description = description;
        this.message = message;
    }

    public String getAccountType() { return accountType; }
    public BigDecimal getMinimumBalance() { return minimumBalance; }
    public String getDescription() { return description; }
    public String getMessage() { return message; }
}