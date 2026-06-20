package com.neobank360app.controller;

import com.neobank360app.dto.LoanProductDTO;
import com.neobank360app.service.LoanProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loans/products")   // ✅ fixed from /api/loans/products
public class LoanProductController {

    private final LoanProductService loanProductService;

    public LoanProductController(LoanProductService loanProductService) {
        this.loanProductService = loanProductService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LoanProductDTO> createProduct(
            @RequestBody LoanProductDTO dto) {
        return new ResponseEntity<>(
                loanProductService.createLoanProduct(dto),
                HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LoanProductDTO>> getAllProducts() {
        return ResponseEntity.ok(loanProductService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(loanProductService.getProductById(id));
    }
}