package com.neobank360app.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.assertj.core.api.Assertions.*;

class BCryptTest {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Test
    @DisplayName("Hash is not equal to plain text")
    void hash_notEqualToPlain() {
        String raw = "SecurePass@123";
        String hash = encoder.encode(raw);
        assertThat(hash).isNotEqualTo(raw);
    }

    @Test
    @DisplayName("matches() returns true for correct password")
    void matches_correctPassword() {
        String raw = "SecurePass@123";
        String hash = encoder.encode(raw);
        assertThat(encoder.matches(raw, hash)).isTrue();
    }

    @Test
    @DisplayName("matches() returns false for wrong password")
    void matches_wrongPassword() {
        String hash = encoder.encode("SecurePass@123");
        assertThat(encoder.matches("WrongPass@456", hash)).isFalse();
    }

    @Test
    @DisplayName("Same password produces different salts each time")
    void saltRandomness() {
        String raw = "SecurePass@123";
        String hash1 = encoder.encode(raw);
        String hash2 = encoder.encode(raw);
        assertThat(hash1).isNotEqualTo(hash2);
    }
}
