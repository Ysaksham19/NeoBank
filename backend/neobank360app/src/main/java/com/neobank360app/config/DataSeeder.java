package com.neobank360app.config;

import com.neobank360app.entity.LoanProduct;
import com.neobank360app.entity.Role;
import com.neobank360app.entity.User;
import com.neobank360app.entity.UserStatus;
import com.neobank360app.repository.LoanProductRepository;
import com.neobank360app.repository.RoleRepository;
import com.neobank360app.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * DataSeeder runs ONLY in the "dev" profile.
 * It is completely excluded from "prod" to prevent accidental
 * default-credential injection into production databases.
 *
 * Roles and LoanProducts are seeded because they are reference data
 * required for the application to function correctly.
 * The admin account is seeded for local development convenience ONLY.
 *
 * In production:
 *   - Roles are created via a Flyway migration (V4 or later).
 *   - The admin account must be created via a one-time secure bootstrap script.
 *   - LoanProducts are managed through the Admin UI.
 */
@Component
@Profile("dev")
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

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
        log.info("[DataSeeder] Running in DEV profile — seeding reference data.");
        seedRoles();
        seedAdmin();
        seedLoanProducts();
        log.info("[DataSeeder] Seeding complete.");
    }

    private void seedRoles() {
        if (!roleRepository.existsByName("ROLE_ADMIN")) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
            log.info("[DataSeeder] ROLE_ADMIN created.");
        }
        if (!roleRepository.existsByName("ROLE_CUSTOMER")) {
            Role customerRole = new Role();
            customerRole.setName("ROLE_CUSTOMER");
            roleRepository.save(customerRole);
            log.info("[DataSeeder] ROLE_CUSTOMER created.");
        }
    }

    /**
     * DEV-ONLY admin account.
     * Password: Admin@123  (change immediately after first login in any shared env)
     */
    private void seedAdmin() {
        if (userRepository.findByEmail("admin@neobank.com").isPresent()) {
            log.debug("[DataSeeder] Admin already exists, skipping.");
            return;
        }

        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow(
                () -> new IllegalStateException("ROLE_ADMIN must be seeded before admin user."));

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
        log.warn("[DataSeeder] DEV admin created: admin@neobank.com / Admin@123 — CHANGE THIS PASSWORD.");
    }

    private void seedLoanProducts() {
        if (loanProductRepository.count() > 0) {
            log.debug("[DataSeeder] LoanProducts already seeded, skipping.");
            return;
        }

        loanProductRepository.saveAll(List.of(
            createProduct("Personal Loan",
                    new BigDecimal("50000"),  new BigDecimal("1000000"),
                    new BigDecimal("12.5"),   "12,24,36,48,60"),

            createProduct("Home Loan",
                    new BigDecimal("500000"), new BigDecimal("10000000"),
                    new BigDecimal("8.75"),   "60,120,180,240"),

            createProduct("Vehicle Loan",
                    new BigDecimal("100000"), new BigDecimal("3000000"),
                    new BigDecimal("9.5"),    "12,24,36,48,60,72"),

            createProduct("Education Loan",
                    new BigDecimal("100000"), new BigDecimal("2000000"),
                    new BigDecimal("10.0"),   "24,36,48,60,84,120")
        ));
        log.info("[DataSeeder] 4 LoanProducts seeded.");
    }

    private LoanProduct createProduct(String name, BigDecimal min, BigDecimal max,
                                      BigDecimal rate, String tenures) {
        LoanProduct p = new LoanProduct();
        p.setProductName(name);
        p.setMinAmount(min);
        p.setMaxAmount(max);
        p.setAnnualInterestRate(rate);
        p.setAllowedTenures(tenures);
        return p;
    }
}
