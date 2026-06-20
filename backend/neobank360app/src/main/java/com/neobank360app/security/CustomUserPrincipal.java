package com.neobank360app.security;

import com.neobank360app.entity.User;
import com.neobank360app.entity.UserStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

public class CustomUserPrincipal implements UserDetails {

    private final User user;

    public CustomUserPrincipal(User user) { this.user = user; }

    public User getUser() { return user; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());
    }

    @Override public String getPassword()              { return user.getPasswordHash(); }
    @Override public String getUsername()              { return user.getEmail(); }
    @Override public boolean isAccountNonExpired()     { return true; }

    /**
     * Returns false when admin sets status to LOCKED.
     * Spring Security responds with 423 Locked on login.
     */
    @Override public boolean isAccountNonLocked()      { return user.getStatus() != UserStatus.LOCKED; }

    @Override public boolean isCredentialsNonExpired() { return true; }

    /**
     * Returns true only when status == ACTIVE.
     * INACTIVE (pending approval) and LOCKED users are blocked with 401.
     */
    @Override public boolean isEnabled()               { return user.getStatus() == UserStatus.ACTIVE; }
}
