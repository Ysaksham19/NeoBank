package com.neobank360app.config;

import com.neobank360app.security.JwtAuthenticationFilter;
import com.neobank360app.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter
            jwtAuthenticationFilter;

    private final CustomUserDetailsService
            customUserDetailsService;

    public SecurityConfig(

            JwtAuthenticationFilter
                    jwtAuthenticationFilter,

            CustomUserDetailsService
                    customUserDetailsService
    ) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;

        this.customUserDetailsService =
                customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain
    securityFilterChain(

            HttpSecurity http
    ) throws Exception {

        http

            .csrf(
                    AbstractHttpConfigurer::disable
            )

            .cors(
                    Customizer.withDefaults()
            )

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(

                        "/api/v1/auth/register/account-type",
                        "/api/v1/auth/register",
                        "/api/v1/auth/login",

                        "/api/v1/otp/send",
                        "/api/v1/otp/verify",

                        "/api/v1/branches",

                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**"

                ).permitAll()

                .anyRequest()
                .authenticated()
            )

            .authenticationProvider(
                    authenticationProvider()
            )

            .addFilterBefore(

                    jwtAuthenticationFilter,

                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public AuthenticationProvider
    authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(
                customUserDetailsService
        );

        provider.setPasswordEncoder(
                passwordEncoder()
        );

        return provider;
    }

    @Bean
    public AuthenticationManager
    authenticationManager(

            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {

        return new RestTemplate();
    }
}