package com.neobank360app.repository;

import com.neobank360app.entity.User;
import com.neobank360app.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCustomerNo(String customerNo);
    boolean existsByPhone(String phone);

    // Sprint 4 — Admin Dashboard: count active users
    long countByStatus(UserStatus status);
}