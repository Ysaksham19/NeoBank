package com.neobank360app.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI neoBankOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("NeoBank Platform API")
                        .description("Sprint 1 — Foundation & Core Banking. PMIS Internship, Infosys Bhubaneswar DC.")
                        .version("1.0.0")
                        .contact(new Contact().name("PMIS Intern Team — Lab 4 & Lab 5"))
                        .license(new License().name("Infosys Internal — Confidential")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Paste your JWT token (without the 'Bearer ' prefix)")));
    }
}