package com.neobank360app.repository;


import com.neobank360app.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    Optional<Branch> findByBranchCode(String branchCode);
    List<Branch> findByStatus(String status);
}
