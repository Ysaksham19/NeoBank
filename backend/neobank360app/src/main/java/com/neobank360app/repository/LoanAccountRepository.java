package com.neobank360app.repository;

import com.neobank360app.entity.LoanAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanAccountRepository extends JpaRepository<LoanAccount, Long> {

    List<LoanAccount> findByUserId(Long userId);
}