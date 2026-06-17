package com.neobank360app.service;

import com.neobank360app.dto.LoanProductDTO;
import com.neobank360app.entity.LoanProduct;
import com.neobank360app.repository.LoanProductRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class LoanProductService {

    private final LoanProductRepository loanProductRepository;

    public LoanProductService(
            LoanProductRepository loanProductRepository
    ) {
        this.loanProductRepository = loanProductRepository;
    }

    public LoanProductDTO createLoanProduct(
            LoanProductDTO dto
    ) {

        if (dto.getMinAmount().compareTo(dto.getMaxAmount()) >= 0) {
            throw new RuntimeException(
                    "Minimum amount must be less than maximum amount"
            );
        }

        LoanProduct loanProduct = new LoanProduct();

        loanProduct.setProductName(dto.getProductName());
        loanProduct.setMinAmount(dto.getMinAmount());
        loanProduct.setMaxAmount(dto.getMaxAmount());
        loanProduct.setAnnualInterestRate(
                dto.getAnnualInterestRate()
        );
        loanProduct.setAllowedTenures(
                dto.getAllowedTenures()
        );

        LoanProduct saved =
                loanProductRepository.save(loanProduct);

        return mapToDTO(saved);
    }

    public List<LoanProductDTO> getAllProducts() {

        List<LoanProduct> products =
                loanProductRepository.findAll();

        List<LoanProductDTO> response =
                new ArrayList<>();

        for (LoanProduct product : products) {
            response.add(mapToDTO(product));
        }

        return response;
    }

    public LoanProductDTO getProductById(Long id) {

        LoanProduct product =
                loanProductRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Loan product not found"
                                ));

        return mapToDTO(product);
    }

    private LoanProductDTO mapToDTO(
            LoanProduct loanProduct
    ) {

        LoanProductDTO dto =
                new LoanProductDTO();

        dto.setId(loanProduct.getId());

        dto.setProductName(
                loanProduct.getProductName()
        );

        dto.setMinAmount(
                loanProduct.getMinAmount()
        );

        dto.setMaxAmount(
                loanProduct.getMaxAmount()
        );

        dto.setAnnualInterestRate(
                loanProduct.getAnnualInterestRate()
        );

        dto.setAllowedTenures(
                loanProduct.getAllowedTenures()
        );

        return dto;
    }
}