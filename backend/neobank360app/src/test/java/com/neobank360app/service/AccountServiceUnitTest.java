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
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceUnitTest {

    @Mock AccountRepository  accountRepository;
    @Mock UserRepository     userRepository;
    @Mock BranchRepository   branchRepository;
    @InjectMocks AccountService svc;

    private User owner, stranger;
    private Account account;

    @BeforeEach
    void setUp() {
        // Role is a JPA @Entity with a String name — not an enum
        Role customerRole = new Role();
        customerRole.setName("CUSTOMER");

        // User has no setId() or setActive() — use ReflectionTestUtils + setStatus()
        owner = new User();
        ReflectionTestUtils.setField(owner, "id", 1L);
        owner.setEmail("own@nb.in");
        owner.setRoles(Set.of(customerRole));
        owner.setStatus(UserStatus.ACTIVE);

        stranger = new User();
        ReflectionTestUtils.setField(stranger, "id", 2L);
        stranger.setEmail("str@nb.in");
        stranger.setRoles(Set.of(customerRole));
        stranger.setStatus(UserStatus.ACTIVE);

        // Branch has no setId() either — same fix
        Branch b = new Branch();
        ReflectionTestUtils.setField(b, "id", 1L);
        b.setBranchName("BBSR");
        b.setBranchCode("B1");
        b.setIfscCode("NEO0B1");

        account = new Account();
        ReflectionTestUtils.setField(account, "id", 10L);
        account.setAccountNo("4001");
        account.setUser(owner);
        account.setAccountType(AccountType.SAVINGS);
        account.setAvailableBalance(new BigDecimal("1000"));
        account.setLedgerBalance(new BigDecimal("1000"));
        account.setStatus(AccountStatus.ACTIVE);
        account.setBranch(b);
    }

    private void mockAuth(String email) {
        Authentication a = mock(Authentication.class);
        when(a.getName()).thenReturn(email);
        SecurityContext c = mock(SecurityContext.class);
        when(c.getAuthentication()).thenReturn(a);
        SecurityContextHolder.setContext(c);
    }

    @Test @DisplayName("getMyAccounts returns only owner's accounts")
    void getMyAccounts_returnsOwned() {
        mockAuth(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(accountRepository.findByUser(owner)).thenReturn(List.of(account));
        assertThat(svc.getMyAccounts()).hasSize(1);
    }

    @Test @DisplayName("getAccountById returns DTO for owner")
    void getAccountById_owner_ok() {
        mockAuth(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account));
        assertThat(svc.getAccountById(10L).getAccountNo()).isEqualTo("4001");
    }

    @Test @DisplayName("getAccountById throws 403 for stranger")
    void getAccountById_stranger_403() {
        mockAuth(stranger.getEmail());
        when(userRepository.findByEmail(stranger.getEmail())).thenReturn(Optional.of(stranger));
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account));
        assertThatThrownBy(() -> svc.getAccountById(10L))
                .isInstanceOf(UnauthorizedAccountAccessException.class);
    }

    @Test @DisplayName("getAccountById throws 404 for unknown id")
    void getAccountById_notFound_404() {
        mockAuth(owner.getEmail());
        when(userRepository.findByEmail(owner.getEmail())).thenReturn(Optional.of(owner));
        when(accountRepository.findById(999L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> svc.getAccountById(999L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}