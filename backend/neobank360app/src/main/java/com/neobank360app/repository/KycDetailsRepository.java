package com.neobank360app.repository;


import com.neobank360app.entity.KycDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KycDetailsRepository extends JpaRepository<KycDetails, Long> {
    boolean existsByAadhaarNumber(String aadhaarNumber);
    boolean existsByPanNumber(String panNumber);
    Optional<KycDetails> findByUser_Id(Long userId);
}
