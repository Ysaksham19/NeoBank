//package com.neobank360app.dto 
//
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.Pattern;
//
//public class AccountTypeSelectionRequest {
//
//    @NotBlank(message = "Account type is required")
//    @Pattern(regexp = "SAVINGS|CURRENT|SALARY",
//             message = "Account type must be SAVINGS, CURRENT, or SALARY")
//    private String accountType;
//
//    public String getAccountType() { return accountType; }
//    public void setAccountType(String accountType) { this.accountType = accountType; }
//}

package com.neobank360app.dto;

import com.neobank360app.entity.AccountType;
import jakarta.validation.constraints.NotNull;

public class AccountTypeSelectionRequest {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    public AccountTypeSelectionRequest() {
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
}