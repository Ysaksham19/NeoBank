package com.neobank360app.config;

import com.neobank360app.entity.LoanProduct;
import com.neobank360app.entity.Role;
import com.neobank360app.entity.User;
import com.neobank360app.entity.UserStatus;
import com.neobank360app.repository.LoanProductRepository;
import com.neobank360app.repository.RoleRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository        roleRepository;
    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final LoanProductRepository loanProductRepository;

    public DataSeeder(RoleRepository roleRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      LoanProductRepository loanProductRepository) {
        this.roleRepository        = roleRepository;
        this.userRepository        = userRepository;
        this.passwordEncoder       = passwordEncoder;
        this.loanProductRepository = loanProductRepository;
    }

    @Override
    public void run(String... args) {
        seedRoles();
        seedAdmin();
        seedLoanProducts(); // ✅ ADDED
    }

    private void seedRoles() {
        if (!roleRepository.existsByName("ROLE_ADMIN")) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }
        if (!roleRepository.existsByName("ROLE_CUSTOMER")) {
            Role customerRole = new Role();
            customerRole.setName("ROLE_CUSTOMER");
            roleRepository.save(customerRole);
        }
    }

    private void seedAdmin() {
        if (userRepository.findByEmail("admin@neobank.com").isPresent()) return;

        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();

        User admin = new User();
        admin.setCustomerNo("NBADMIN001");
        admin.setFullName("NeoBank Admin");
        admin.setEmail("admin@neobank.com");
        admin.setPhone("9999999999");
        admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
        admin.setStatus(UserStatus.ACTIVE);
        admin.setKycStatus("VERIFIED");
        admin.setRoles(Set.of(adminRole));
        userRepository.save(admin);
    }

    // ✅ NEW — seeds 4 loan products on first boot
    private void seedLoanProducts() {
        if (loanProductRepository.count() > 0) return; // skip if already seeded

        loanProductRepository.saveAll(java.util.List.of(

            createProduct("Personal Loan",
                    new BigDecimal("50000"),
                    new BigDecimal("1000000"),
                    new BigDecimal("12.5"),
                    "12,24,36,48,60"),

            createProduct("Home Loan",
                    new BigDecimal("500000"),
                    new BigDecimal("10000000"),
                    new BigDecimal("8.75"),
                    "60,120,180,240"),

            createProduct("Vehicle Loan",
                    new BigDecimal("100000"),
                    new BigDecimal("3000000"),
                    new BigDecimal("9.5"),
                    "12,24,36,48,60,72"),

            createProduct("Education Loan",
                    new BigDecimal("100000"),
                    new BigDecimal("2000000"),
                    new BigDecimal("10.0"),
                    "24,36,48,60,84,120")
        ));
    }

    private LoanProduct createProduct(String name,
                                      BigDecimal min,
                                      BigDecimal max,
                                      BigDecimal rate,
                                      String tenures) {
        LoanProduct p = new LoanProduct();
        p.setProductName(name);
        p.setMinAmount(min);
        p.setMaxAmount(max);
        p.setAnnualInterestRate(rate);
        p.setAllowedTenures(tenures);
        return p;
    }
}