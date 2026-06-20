package com.neobank360app.entity;

/**
 * Lifecycle states for a NeoBank user account.
 *
 * ACTIVE   – admin has approved the account; user can log in and use all features.
 * INACTIVE – account pending admin approval (default after registration).
 * LOCKED   – account suspended due to security violation or admin action;
 *             Spring Security returns 423 Locked on login attempt.
 */
public enum UserStatus {
    ACTIVE,
    INACTIVE,
    LOCKED
}
