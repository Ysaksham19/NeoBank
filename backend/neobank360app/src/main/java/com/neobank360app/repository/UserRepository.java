package com.neobank360app.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.neobank360app.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByCustomerNo(String customerNo);
    boolean existsByPhone(String phone);
}
