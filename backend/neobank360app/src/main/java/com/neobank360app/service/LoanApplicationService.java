//package com.neobank360app.service;
//
//import com.neobank360app.dto.LoanApplicationRequestDTO;
//import com.neobank360app.dto.LoanApplicationResponseDTO;
//import com.neobank360app.entity.LoanApplication;
//import com.neobank360app.entity.LoanProduct;
//import com.neobank360app.entity.User;
//import com.neobank360app.entity.LoanApplicationStatus;
//import com.neobank360app.repository.LoanApplicationRepository;
//import com.neobank360app.repository.LoanProductRepository;
//import com.neobank360app.repository.UserRepository;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.List;
//
//@Service
//public class LoanApplicationService {
//
//    private final LoanApplicationRepository loanApplicationRepository;
//
//    private final LoanProductRepository loanProductRepository;
//
//    private final UserRepository userRepository;
//
//    public LoanApplicationService(
//            LoanApplicationRepository loanApplicationRepository,
//            LoanProductRepository loanProductRepository,
//            UserRepository userRepository
//    ) {
//        this.loanApplicationRepository = loanApplicationRepository;
//        this.loanProductRepository = loanProductRepository;
//        this.userRepository = userRepository;
//    }
//
//    public LoanApplicationResponseDTO applyLoan(
//            LoanApplicationRequestDTO dto
//    ) {
//
//        Authentication authentication =
//                SecurityContextHolder.getContext()
//                        .getAuthentication();
//
//        String email = authentication.getName();
//
//        User user =
//                userRepository.findByEmail(email)
//                        .orElseThrow(() ->
//                                new RuntimeException("User not found")
//                        );
//
//        LoanProduct loanProduct =
//                loanProductRepository.findById(
//                                dto.getLoanProductId()
//                        )
//                        .orElseThrow(() ->
//                                new RuntimeException(
//                                        "Loan product not found"
//                                ));
//
//        if (dto.getRequestedAmount().compareTo(
//                loanProduct.getMinAmount()) < 0
//                ||
//                dto.getRequestedAmount().compareTo(
//                        loanProduct.getMaxAmount()) > 0) {
//
//            throw new RuntimeException(
//                    "Requested amount outside allowed range"
//            );
//        }
//
//        List<String> tenures =
//                Arrays.asList(
//                        loanProduct.getAllowedTenures().split(",")
//                );
//
//        if (!tenures.contains(
//                String.valueOf(
//                        dto.getRequestedTenureMonths()
//                ))) {
//
//            throw new RuntimeException(
//                    "Invalid tenure selected"
//            );
//        }
//
//        boolean alreadyExists =
//                loanApplicationRepository
//                        .findByUserIdAndLoanProductIdAndStatus(
//                                user.getId(),
//                                loanProduct.getId(),
//                                LoanApplicationStatus.PENDING
//                        )
//                        .isPresent();
//
//        if (alreadyExists) {
//
//            throw new RuntimeException(
//                    "Pending application already exists"
//            );
//        }
//
//        LoanApplication application =
//                new LoanApplication();
//
//        application.setUser(user);
//
//        application.setLoanProduct(loanProduct);
//
//        application.setRequestedAmount(
//                dto.getRequestedAmount()
//        );
//
//        application.setRequestedTenureMonths(
//                dto.getRequestedTenureMonths()
//        );
//
//        application.setStatus(
//                LoanApplicationStatus.PENDING
//        );
//
//        LoanApplication saved =
//                loanApplicationRepository.save(application);
//
//        return mapToResponse(saved);
//    }
//
//    public List<LoanApplicationResponseDTO> getMyApplications() {
//
//        Authentication authentication =
//                SecurityContextHolder.getContext()
//                        .getAuthentication();
//
//        String email = authentication.getName();
//
//        User user =
//                userRepository.findByEmail(email)
//                        .orElseThrow(() ->
//                                new RuntimeException("User not found")
//                        );
//
//        List<LoanApplication> applications =
//                loanApplicationRepository.findByUserId(
//                        user.getId()
//                );
//
//        List<LoanApplicationResponseDTO> response =
//                new ArrayList<>();
//
//        for (LoanApplication application : applications) {
//
//            response.add(
//                    mapToResponse(application)
//            );
//        }
//
//        return response;
//    }
//
//    private LoanApplicationResponseDTO mapToResponse(
//            LoanApplication application
//    ) {
//
//        LoanApplicationResponseDTO dto =
//                new LoanApplicationResponseDTO();
//
//        dto.setApplicationId(
//                application.getId()
//        );
//
//        dto.setProductName(
//                application.getLoanProduct().getProductName()
//        );
//
//        dto.setRequestedAmount(
//                application.getRequestedAmount()
//        );
//
//        dto.setRequestedTenureMonths(
//                application.getRequestedTenureMonths()
//        );
//
//        dto.setStatus(
//                application.getStatus().name()
//        );
//
//        dto.setAdminRemarks(
//                application.getAdminRemarks()
//        );
//
//        dto.setAppliedAt(
//                application.getAppliedAt()
//        );
//
//        return dto;
//    }
//}



package com.neobank360app.service;

import com.neobank360app.dto.LoanApplicationRequestDTO;
import com.neobank360app.dto.LoanApplicationResponseDTO;
import com.neobank360app.entity.LoanApplication;
import com.neobank360app.entity.LoanApplicationStatus;
import com.neobank360app.entity.LoanProduct;
import com.neobank360app.entity.User;
import com.neobank360app.repository.LoanApplicationRepository;
import com.neobank360app.repository.LoanProductRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class LoanApplicationService {

    private final LoanApplicationRepository loanApplicationRepository;

    private final LoanProductRepository loanProductRepository;

    private final UserRepository userRepository;

    public LoanApplicationService(
            LoanApplicationRepository loanApplicationRepository,
            LoanProductRepository loanProductRepository,
            UserRepository userRepository
    ) {

        this.loanApplicationRepository = loanApplicationRepository;
        this.loanProductRepository = loanProductRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // APPLY LOAN
    // =========================================================

    public LoanApplicationResponseDTO applyLoan(
            LoanApplicationRequestDTO dto
    ) {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException("User not found")
                        );

        LoanProduct loanProduct =
                loanProductRepository.findById(
                                dto.getLoanProductId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Loan product not found"
                                ));

        if (dto.getRequestedAmount().compareTo(
                loanProduct.getMinAmount()) < 0
                ||
                dto.getRequestedAmount().compareTo(
                        loanProduct.getMaxAmount()) > 0) {

            throw new RuntimeException(
                    "Requested amount outside allowed range"
            );
        }

        List<String> tenures =
                Arrays.asList(
                        loanProduct.getAllowedTenures().split(",")
                );

        if (!tenures.contains(
                String.valueOf(
                        dto.getRequestedTenureMonths()
                ))) {

            throw new RuntimeException(
                    "Invalid tenure selected"
            );
        }

        boolean alreadyExists =
                loanApplicationRepository
                        .findByUserIdAndLoanProductIdAndStatus(
                                user.getId(),
                                loanProduct.getId(),
                                LoanApplicationStatus.PENDING
                        )
                        .isPresent();

        if (alreadyExists) {

            throw new RuntimeException(
                    "Pending application already exists"
            );
        }

        LoanApplication application =
                new LoanApplication();

        application.setUser(user);

        application.setLoanProduct(loanProduct);

        application.setRequestedAmount(
                dto.getRequestedAmount()
        );

        application.setRequestedTenureMonths(
                dto.getRequestedTenureMonths()
        );

        application.setStatus(
                LoanApplicationStatus.PENDING
        );

        LoanApplication saved =
                loanApplicationRepository.save(application);

        return mapToResponse(saved);
    }

    // =========================================================
    // MY APPLICATIONS
    // =========================================================

    public List<LoanApplicationResponseDTO> getMyApplications() {

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException("User not found")
                        );

        List<LoanApplication> applications =
                loanApplicationRepository.findByUserId(
                        user.getId()
                );

        List<LoanApplicationResponseDTO> response =
                new ArrayList<>();

        for (LoanApplication application : applications) {

            response.add(
                    mapToResponse(application)
            );
        }

        return response;
    }

    // =========================================================
    // ADMIN - GET ALL APPLICATIONS
    // =========================================================

    public List<LoanApplicationResponseDTO>
    getAllApplications() {

        List<LoanApplication> applications =
                loanApplicationRepository.findAll();

        List<LoanApplicationResponseDTO> response =
                new ArrayList<>();

        for (LoanApplication application : applications) {

            response.add(
                    mapToResponse(application)
            );
        }

        return response;
    }

    // =========================================================
    // DTO MAPPER
    // =========================================================

    private LoanApplicationResponseDTO mapToResponse(
            LoanApplication application
    ) {

        LoanApplicationResponseDTO dto =
                new LoanApplicationResponseDTO();

        dto.setApplicationId(
                application.getId()
        );

        dto.setProductName(
                application.getLoanProduct().getProductName()
        );

        dto.setRequestedAmount(
                application.getRequestedAmount()
        );

        dto.setRequestedTenureMonths(
                application.getRequestedTenureMonths()
        );

        dto.setStatus(
                application.getStatus().name()
        );

        dto.setAdminRemarks(
                application.getAdminRemarks()
        );

        dto.setAppliedAt(
                application.getAppliedAt()
        );

        return dto;
    }
}