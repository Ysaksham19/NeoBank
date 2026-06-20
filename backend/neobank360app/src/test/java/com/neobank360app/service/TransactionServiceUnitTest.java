package com.neobank360app.service;

import com.neobank360app.entity.*;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.exception.UnauthorizedAccountAccessException;
import com.neobank360app.repository.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.*;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceUnitTest {

    @Mock TransactionRepository transactionRepository;
    @Mock AccountRepository     accountRepository;
    @Mock UserRepository        userRepository;
    @Mock RewardService         rewardService;
    @Mock NotificationService   notificationService;
    @InjectMocks TransactionService svc;

    private User    owner;
    private User    stranger;
    private Account account;

    @BeforeEach
    void setUp() {
        // Role is a JPA @Entity with a name String — NOT an enum
        Role customerRole = new Role();
        customerRole.setName("CUSTOMER");

        // User has no setId() — use ReflectionTestUtils to set the auto-generated id field
        // User has no setActive() — it uses setStatus(String) with value "ACTIVE"
        owner = new User();
        ReflectionTestUtils.setField(owner, "id", 1L);
        owner.setEmail("o@nb.in");
        owner.setRoles(Set.of(customerRole));
        owner.setStatus("ACTIVE");

        stranger = new User();
        ReflectionTestUtils.setField(stranger, "id", 2L);
        stranger.setEmail("s@nb.in");
        stranger.setRoles(Set.of(customerRole));
        stranger.setStatus("ACTIVE");

        account = new Account();
        ReflectionTestUtils.setField(account, "id", 10L);
        account.setAccountNo("4001");
        account.setUser(owner);
        account.setAvailableBalance(new BigDecimal("5000"));
        account.setLedgerBalance(new BigDecimal("5000"));
        account.setStatus(AccountStatus.ACTIVE);
    }

    private void mockCtx(String email) {
        Authentication a = mock(Authentication.class);
        when(a.getName()).thenReturn(email);
        SecurityContext c = mock(SecurityContext.class);
        when(c.getAuthentication()).thenReturn(a);
        SecurityContextHolder.setContext(c);
    }

    @Test @DisplayName("Overdraft → IllegalArgumentException")
    void overdraft_throws() {
        mockCtx(owner.getEmail());
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account));
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        assertThatThrownBy(() -> svc.withdraw(10L, new BigDecimal("9999"), "test"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Insufficient");
    }

    @Test @DisplayName("Zero deposit → IllegalArgumentException")
    void zeroDeposit_throws() {
        mockCtx(owner.getEmail());
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account));
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        assertThatThrownBy(() -> svc.deposit(10L, BigDecimal.ZERO, "z"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("greater than zero");
    }

    @Test @DisplayName("Negative withdrawal → IllegalArgumentException")
    void negativeWithdraw_throws() {
        mockCtx(owner.getEmail());
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account));
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        assertThatThrownBy(() -> svc.withdraw(10L, new BigDecimal("-50"), "n"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test @DisplayName("Wrong user → UnauthorizedAccountAccessException")
    void wrongUser_throws() {
        mockCtx(stranger.getEmail());
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account));
        when(userRepository.findByEmail(stranger.getEmail())).thenReturn(Optional.of(stranger));
        assertThatThrownBy(() -> svc.withdraw(10L, new BigDecimal("100"), "own"))
                .isInstanceOf(UnauthorizedAccountAccessException.class);
    }

    @Test @DisplayName("Invalid accountId → ResourceNotFoundException")
    void badAccountId_throws() {
        mockCtx(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(accountRepository.findById(999L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> svc.withdraw(999L, new BigDecimal("100"), "404"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test @DisplayName("Valid deposit increases balance to 7000")
    void deposit_updatesBalance() {
        mockCtx(owner.getEmail());
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account));
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(transactionRepository.save(any())).thenReturn(new Transaction());
        when(accountRepository.save(any())).thenReturn(account);
        svc.deposit(10L, new BigDecimal("2000"), "salary");
        assertThat(account.getAvailableBalance()).isEqualByComparingTo("7000.00");
    }
}