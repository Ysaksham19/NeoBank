package com.neobank360app.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.neobank360app.entity.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
