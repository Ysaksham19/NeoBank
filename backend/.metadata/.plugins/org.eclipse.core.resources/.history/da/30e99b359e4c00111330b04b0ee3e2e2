package com.neobank360app.config;

import com.neobank360app.entity.Role;
import com.neobank360app.entity.User;
import com.neobank360app.repository.RoleRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        seedRoles();

        seedAdmin();
    }

    // ───────────────── ROLES ─────────────────

    private void seedRoles() {

        if (!roleRepository.existsByName("ROLE_ADMIN")) {

            Role adminRole =
                    new Role();

            adminRole.setName("ROLE_ADMIN");

            roleRepository.save(adminRole);
        }

        if (!roleRepository.existsByName("ROLE_USER")) {

            Role userRole =
                    new Role();

            userRole.setName("ROLE_USER");

            roleRepository.save(userRole);
        }
    }

    // ───────────────── ADMIN USER ─────────────────

    private void seedAdmin() {

        if (userRepository.findByEmail(
                "admin@neobank.com"
        ).isPresent()) {

            return;
        }

        Role adminRole =
                roleRepository.findByName(
                        "ROLE_ADMIN"
                ).orElseThrow();

        User admin =
                new User();

        admin.setCustomerNo(
                "NBADMIN001"
        );

        admin.setFullName(
                "NeoBank Admin"
        );

        admin.setEmail(
                "admin@neobank.com"
        );

        admin.setPhone(
                "9999999999"
        );

        admin.setPasswordHash(
                passwordEncoder.encode(
                        "Admin@123"
                )
        );

        admin.setStatus(
                "ACTIVE"
        );

        admin.setKycStatus(
                "VERIFIED"
        );

        admin.setRoles(
                Set.of(adminRole)
        );

        userRepository.save(admin);
    }
}