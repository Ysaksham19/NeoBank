package com.neobank360app.dto;

import com.neobank360app.entity.AccountType;
import jakarta.validation.constraints.NotNull;

public class AccountRequestDTO {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @NotNull(message = "Branch is required")
    private Long branchId;

    public AccountRequestDTO() {
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }
}