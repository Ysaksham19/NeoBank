package com.neobank360app.service;

import com.neobank360app.dto.*;
import com.neobank360app.entity.*;
import com.neobank360app.exception.DuplicateResourceException;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.repository.*;
import com.neobank360app.security.CustomUserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final BranchRepository branchRepository;
    private final AccountRepository accountRepository;
    private final KycDetailsRepository kycDetailsRepository;
    private final OtpVerificationRepository otpVerificationRepository;
    private final JavaMailSender mailSender;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder, JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       BranchRepository branchRepository, AccountRepository accountRepository,
                       KycDetailsRepository kycDetailsRepository,
                       OtpVerificationRepository otpVerificationRepository,
                       JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.branchRepository = branchRepository;
        this.accountRepository = accountRepository;
        this.kycDetailsRepository = kycDetailsRepository;
        this.otpVerificationRepository = otpVerificationRepository;
        this.mailSender = mailSender;
    }

    // ── STEP 1: Account Type Selection ───────────────────────────────────────
    public AccountTypeSelectionResponse selectAccountType(AccountTypeSelectionRequest request) {
        String type = request.getAccountType().toUpperCase();
        BigDecimal minBalance = getMinimumBalance(type);
        String description = switch (type) {
            case "SAVINGS" -> "Standard savings account. Minimum balance: ₹1,000";
            case "CURRENT" -> "Business current account. Minimum balance: ₹5,000";
            case "SALARY"  -> "Zero-balance salary account";
            default        -> "";
        };
        return new AccountTypeSelectionResponse(type, minBalance, description,
                "Account type selected. Please proceed to OTP verification.");
    }

    // ── REGISTER ─────────────────────────────────────────────────────────────
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword()))
            throw new IllegalArgumentException("Passwords do not match.");

        if (userRepository.existsByEmail(request.getEmail()))
            throw new DuplicateResourceException("Email is already registered.");
        if (userRepository.existsByPhone(request.getPhone()))
            throw new DuplicateResourceException("Phone number is already registered.");
        if (kycDetailsRepository.existsByAadhaarNumber(request.getAadhaarNumber()))
            throw new DuplicateResourceException("Aadhaar number is already registered.");
        if (kycDetailsRepository.existsByPanNumber(request.getPanNumber()))
            throw new DuplicateResourceException("PAN number is already registered.");

        validateOtpVerified(request.getEmailOtpReference(), "EMAIL_OTP");
        validateOtpVerified(request.getMobileOtpReference(), "MOBILE_OTP");

        Branch branch = branchRepository.findByBranchCode(request.getBranchCode())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid branch selected."));

        // FIX BUG-05: Use ROLE_CUSTOMER (matches DataSeeder seed + SecurityConfig)
        Role userRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new IllegalStateException("Default role not found. Contact admin."));

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setCustomerNo(generateCustomerId());
        // FIX BUG-02: User starts as INACTIVE — admin must approve before login
        user.setStatus(UserStatus.INACTIVE);
        user.setKycStatus("PENDING");
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        KycDetails kyc = new KycDetails();
        kyc.setUser(savedUser);
        kyc.setAadhaarNumber(request.getAadhaarNumber());
        kyc.setPanNumber(request.getPanNumber());
        kyc.setAadhaarVerified(false);
        kyc.setPanVerified(false);
        kyc.setKycStatus("PENDING");
        kycDetailsRepository.save(kyc);

        // FIX BUG-03 & BUG-04: Use enum types for accountType and status
        Account account = new Account();
        account.setAccountNo(generateAccountNo());
        account.setUser(savedUser);
        account.setAccountType(AccountType.valueOf(request.getAccountType().toUpperCase()));
        account.setCurrency("INR");
        account.setAvailableBalance(getMinimumBalance(request.getAccountType()));
        account.setLedgerBalance(getMinimumBalance(request.getAccountType()));
        account.setBranch(branch);
        account.setStatus(AccountStatus.ACTIVE);
        accountRepository.save(account);

        sendWelcomeEmail(savedUser, account, branch);

        // Return response WITHOUT a JWT token — user must wait for admin approval
        log.info("User registered (pending admin approval): customerId={}, accountType={}",
                savedUser.getCustomerNo(), account.getAccountType());
        return buildAuthResponse(null, savedUser, account, branch);
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));
        CustomUserPrincipal principal = (CustomUserPrincipal) auth.getPrincipal();
        User user = principal.getUser();

        // Guard: block login if account not yet approved by admin
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "Your account is pending admin approval. Please wait for activation.");
        }

        List<Account> accounts = accountRepository.findByUser(user);
        Account account = accounts.isEmpty() ? null : accounts.get(0);
        Branch branch = (account != null) ? account.getBranch() : null;
        String token = jwtService.generateToken(principal);
        log.info("User logged in: customerId={}", user.getCustomerNo());
        return buildAuthResponse(token, user, account, branch);
    }

    // ── ME ────────────────────────────────────────────────────────────────────
    public MeResponse me(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        MeResponse response = new MeResponse();
        response.setUserId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setCustomerId(user.getCustomerNo());
        // FIX BUG-06: convert UserStatus enum to String
        response.setStatus(user.getStatus() != null ? user.getStatus().name() : null);
        response.setKycStatus(user.getKycStatus());
        response.setRoles(user.getRoles().stream()
                .map(Role::getName).collect(Collectors.toSet()));
        return response;
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────

    private String generateCustomerId() {
        // FIX BUG-21: use 100 retries and wider range for collision safety
        for (int i = 0; i < 100; i++) {
            String id = String.valueOf(100_000_000L + (long)(SECURE_RANDOM.nextDouble() * 900_000_000L));
            if (!userRepository.existsByCustomerNo(id)) return id;
        }
        throw new IllegalStateException("Unable to generate unique Customer ID.");
    }

    private String generateAccountNo() {
        for (int i = 0; i < 100; i++) {
            String no = "4001" + (SECURE_RANDOM.nextInt(90000000) + 10000000);
            if (!accountRepository.existsByAccountNo(no)) return no;
        }
        throw new IllegalStateException("Unable to generate unique Account Number.");
    }

    private BigDecimal getMinimumBalance(String accountType) {
        return switch (accountType.toUpperCase()) {
            case "SAVINGS" -> new BigDecimal("1000.00");
            case "CURRENT" -> new BigDecimal("5000.00");
            default        -> BigDecimal.ZERO;
        };
    }

    private void validateOtpVerified(String reference, String otpType) {
        boolean verified = otpVerificationRepository
                .existsByReferenceAndOtpTypeAndIsVerifiedTrue(reference, otpType);
        if (!verified)
            throw new IllegalArgumentException(
                    otpType.equals("EMAIL_OTP")
                            ? "Email OTP not verified. Please verify your email first."
                            : "Mobile OTP not verified. Please verify your phone first.");
    }

    private AuthResponse buildAuthResponse(String token, User user, Account account, Branch branch) {
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setCustomerId(user.getCustomerNo());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus() != null ? user.getStatus().name() : null);
        response.setKycStatus(user.getKycStatus());
        response.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        if (account != null) {
            response.setAccountId(account.getId());
            response.setAccountNo(account.getAccountNo());
            response.setAccountType(account.getAccountType() != null ? account.getAccountType().name() : null);
            response.setAccountStatus(account.getStatus() != null ? account.getStatus().name() : null);
            response.setAvailableBalance(account.getAvailableBalance());
            response.setLedgerBalance(account.getLedgerBalance());
            response.setCurrency(account.getCurrency());
        }
        if (branch != null) {
            response.setBranchId(branch.getId());
            response.setBranchName(branch.getBranchName());
            response.setBranchCode(branch.getBranchCode());
        }
        return response;
    }

    private void sendWelcomeEmail(User user, Account account, Branch branch) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(user.getEmail());
            mail.setSubject("Welcome to NeoBank360 – Account Created");
            mail.setText(
                    "Dear " + user.getFullName() + ",\n\n" +
                    "Your NeoBank360 account has been created successfully.\n\n" +
                    "Customer ID : " + user.getCustomerNo() + "\n" +
                    "Account No  : " + account.getAccountNo() + "\n" +
                    "Account Type: " + account.getAccountType().name() + "\n" +
                    "Branch      : " + branch.getBranchName() + "\n\n" +
                    "Your account is pending admin approval. You will be notified once it is activated.\n\n" +
                    "Regards,\nNeoBank360 Team"
            );
            mailSender.send(mail);
        } catch (Exception e) {
            log.warn("Failed to send welcome email to {}: {}", user.getEmail(), e.getMessage());
        }
    }
}
