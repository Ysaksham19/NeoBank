package com.neobank360app.service;

import org.junit.jupiter.api.*;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;

import static org.assertj.core.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET = "dGVzdC1zZWNyZXQta2V5LWZvci1uZW9iYW5rLXVuaXQtdGVzdGluZy0xMjM0NTY=";
    private static final long   EXP_MS = 86_400_000L;

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "jwtSecret",    SECRET);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", EXP_MS);
    }

    private UserDetails user(String email) {
        return new User(email, "pw", Collections.emptyList());
    }

    @Test @DisplayName("Token subject equals email")
    void tokenSubjectEqualsEmail() {
        String token = jwtService.generateToken(user("c1@neobank.in"));
        assertThat(jwtService.extractUsername(token)).isEqualTo("c1@neobank.in");
    }

    @Test @DisplayName("Token expiry within 24-hour window")
    void tokenExpiryWithin24Hours() {
        String token = jwtService.generateToken(user("c2@neobank.in"));
        long ttl = jwtService.extractExpiration(token).getTime() - System.currentTimeMillis();
        assertThat(ttl).isBetween(EXP_MS - 5_000, EXP_MS + 5_000);
    }

    @Test @DisplayName("isTokenValid returns true for same user")
    void isTokenValid_sameUser() {
        UserDetails ud = user("c3@neobank.in");
        assertThat(jwtService.isTokenValid(jwtService.generateToken(ud), ud)).isTrue();
    }

    @Test @DisplayName("isTokenValid returns false for different user")
    void isTokenValid_differentUser() {
        String token = jwtService.generateToken(user("alice@neobank.in"));
        assertThat(jwtService.isTokenValid(token, user("bob@neobank.in"))).isFalse();
    }

    @Test @DisplayName("Tampered token fails validation")
    void tamperedToken_fails() {
        String token   = jwtService.generateToken(user("admin@neobank.in"));
        String tampered = token.substring(0, token.length() - 4) + "XXXX";
        assertThat(jwtService.isTokenValid(tampered, user("admin@neobank.in"))).isFalse();
    }
}