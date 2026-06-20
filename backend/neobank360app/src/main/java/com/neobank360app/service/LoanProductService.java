package com.neobank360app.service;

import com.neobank360app.dto.LoanProductDTO;
import com.neobank360app.entity.LoanProduct;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.LoanProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanProductService {

    private final LoanProductRepository loanProductRepository;

    public LoanProductService(LoanProductRepository loanProductRepository) {
        this.loanProductRepository = loanProductRepository;
    }

    public LoanProductDTO createLoanProduct(LoanProductDTO dto) {
        if (dto.getMinAmount().compareTo(dto.getMaxAmount()) >= 0) {
            throw new IllegalArgumentException(
                    "Minimum amount must be less than maximum amount.");
        }

        LoanProduct loanProduct = new LoanProduct();
        loanProduct.setProductName(dto.getProductName());
        loanProduct.setMinAmount(dto.getMinAmount());
        loanProduct.setMaxAmount(dto.getMaxAmount());
        loanProduct.setAnnualInterestRate(dto.getAnnualInterestRate());
        loanProduct.setAllowedTenures(dto.getAllowedTenures());

        return mapToDTO(loanProductRepository.save(loanProduct));
    }

    public List<LoanProductDTO> getAllProducts() {
        return loanProductRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public LoanProductDTO getProductById(Long id) {
        LoanProduct product = loanProductRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Loan product not found."));
        return mapToDTO(product);
    }

    private LoanProductDTO mapToDTO(LoanProduct loanProduct) {
        LoanProductDTO dto = new LoanProductDTO();
        dto.setId(loanProduct.getId());
        dto.setProductName(loanProduct.getProductName());
        dto.setMinAmount(loanProduct.getMinAmount());
        dto.setMaxAmount(loanProduct.getMaxAmount());
        dto.setAnnualInterestRate(loanProduct.getAnnualInterestRate());
        dto.setAllowedTenures(loanProduct.getAllowedTenures());
        return dto;
    }
}