package com.neobank360app.service;

import com.neobank360app.dto.LoanApplicationRequestDTO;
import com.neobank360app.dto.LoanApplicationResponseDTO;
import com.neobank360app.entity.LoanApplication;
import com.neobank360app.entity.LoanApplicationStatus;
import com.neobank360app.entity.LoanProduct;
import com.neobank360app.entity.User;
import com.neobank360app.exception.ConflictException;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.LoanApplicationRepository;
import com.neobank360app.repository.LoanProductRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanProductRepository loanProductRepository;
    private final UserRepository userRepository;

    public LoanApplicationService(
            LoanApplicationRepository loanApplicationRepository,
            LoanProductRepository loanProductRepository,
            UserRepository userRepository) {
        this.loanApplicationRepository = loanApplicationRepository;
        this.loanProductRepository = loanProductRepository;
        this.userRepository = userRepository;
    }

    // ─── APPLY LOAN ──────────────────────────────────────

    public LoanApplicationResponseDTO applyLoan(LoanApplicationRequestDTO dto) {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        LoanProduct loanProduct = loanProductRepository
                .findById(dto.getLoanProductId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Loan product not found."));

        // ✅ Amount range validation — 400
        if (dto.getRequestedAmount().compareTo(loanProduct.getMinAmount()) < 0
                || dto.getRequestedAmount().compareTo(loanProduct.getMaxAmount()) > 0) {
            throw new IllegalArgumentException(
                    "Requested amount must be between "
                    + loanProduct.getMinAmount() + " and "
                    + loanProduct.getMaxAmount() + ".");
        }

        // ✅ Tenure validation — 400
        List<String> tenures = Arrays.asList(
                loanProduct.getAllowedTenures().split(","));
        if (!tenures.contains(String.valueOf(dto.getRequestedTenureMonths()))) {
            throw new IllegalArgumentException(
                    "Invalid tenure. Allowed tenures: "
                    + loanProduct.getAllowedTenures() + " months.");
        }

        // ✅ Duplicate pending application — 409
        boolean alreadyExists = loanApplicationRepository
                .findByUserIdAndLoanProductIdAndStatus(
                        user.getId(),
                        loanProduct.getId(),
                        LoanApplicationStatus.PENDING)
                .isPresent();

        if (alreadyExists) {
            throw new ConflictException(
                    "You already have a pending application for this loan product.");
        }

        LoanApplication application = new LoanApplication();
        application.setUser(user);
        application.setLoanProduct(loanProduct);
        application.setRequestedAmount(dto.getRequestedAmount());
        application.setRequestedTenureMonths(dto.getRequestedTenureMonths());
        application.setStatus(LoanApplicationStatus.PENDING);

        return mapToResponse(loanApplicationRepository.save(application));
    }

    // ─── MY APPLICATIONS ─────────────────────────────────

    public List<LoanApplicationResponseDTO> getMyApplications() {

        String email = getCurrentUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        return loanApplicationRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─── ADMIN — GET ALL APPLICATIONS ────────────────────

    public List<LoanApplicationResponseDTO> getAllApplications() {
        return loanApplicationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ─── HELPERS ─────────────────────────────────────────

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder
                .getContext().getAuthentication();
        return auth.getName();
    }

    private LoanApplicationResponseDTO mapToResponse(LoanApplication application) {
        LoanApplicationResponseDTO dto = new LoanApplicationResponseDTO();
        dto.setApplicationId(application.getId());
        dto.setProductName(application.getLoanProduct().getProductName());
        dto.setRequestedAmount(application.getRequestedAmount());
        dto.setRequestedTenureMonths(application.getRequestedTenureMonths());
        dto.setStatus(application.getStatus().name());
        dto.setAdminRemarks(application.getAdminRemarks());
        dto.setAppliedAt(application.getAppliedAt());
        return dto;
    }
}