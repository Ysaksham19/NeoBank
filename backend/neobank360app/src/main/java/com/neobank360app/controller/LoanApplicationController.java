package com.neobank360app.controller;

import com.neobank360app.dto.LoanApplicationRequestDTO;
import com.neobank360app.dto.LoanApplicationResponseDTO;
import com.neobank360app.service.LoanApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;

    public LoanApplicationController(
            LoanApplicationService loanApplicationService
    ) {
        this.loanApplicationService =
                loanApplicationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<LoanApplicationResponseDTO> applyLoan(
            @Valid @RequestBody LoanApplicationRequestDTO dto
    ) {

        LoanApplicationResponseDTO response =
                loanApplicationService.applyLoan(dto);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<LoanApplicationResponseDTO>>
    getMyApplications() {

        return ResponseEntity.ok(
                loanApplicationService.getMyApplications()
        );
    }
}