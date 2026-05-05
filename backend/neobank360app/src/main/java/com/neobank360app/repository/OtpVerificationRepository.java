package com.neobank360app.repository;


import com.neobank360app.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findTopByReferenceAndOtpTypeAndIsVerifiedFalseOrderByCreatedAtDesc(
            String reference, String otpType);
    boolean existsByReferenceAndOtpTypeAndIsVerifiedTrue(String reference, String otpType);
}
