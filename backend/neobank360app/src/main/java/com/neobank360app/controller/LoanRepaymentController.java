package com.neobank360app.controller;

import com.neobank360app.dto.LoanAccountDTO;
import com.neobank360app.dto.RepaymentScheduleDTO;
import com.neobank360app.service.LoanRepaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanRepaymentController {

    private final LoanRepaymentService loanRepaymentService;

    public LoanRepaymentController(
            LoanRepaymentService loanRepaymentService
    ) {
        this.loanRepaymentService =
                loanRepaymentService;
    }

    @GetMapping("/my-accounts")
    public ResponseEntity<List<LoanAccountDTO>>
    getMyLoanAccounts() {

        return ResponseEntity.ok(
                loanRepaymentService.getMyLoanAccounts()
        );
    }

    @GetMapping("/{loanAccountId}/repayments")
    public ResponseEntity<List<RepaymentScheduleDTO>>
    getRepaymentSchedule(
            @PathVariable Long loanAccountId
    ) {

        return ResponseEntity.ok(
                loanRepaymentService
                        .getRepaymentSchedule(
                                loanAccountId
                        )
        );
    }

    @PatchMapping("/{loanAccountId}/repayments/{repaymentId}/pay")
    public ResponseEntity<String> markAsPaid(
            @PathVariable Long loanAccountId,
            @PathVariable Long repaymentId
    ) {

        return ResponseEntity.ok(
                loanRepaymentService.markAsPaid(
                        loanAccountId,
                        repaymentId
                )
        );
    }
}