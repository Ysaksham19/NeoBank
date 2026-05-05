package com.neobank360app.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.neobank360app.entity.Account;
import com.neobank360app.entity.User;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNo(String accountNo);
    List<Account> findByUser(User user);
    boolean existsByAccountNo(String accountNo);
    Optional<Account> findByUserId(Long userId);
}
