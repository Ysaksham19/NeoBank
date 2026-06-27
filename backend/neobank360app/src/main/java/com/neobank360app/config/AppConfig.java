package com.neobank360app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.web.client.RestTemplate;

import java.util.concurrent.Executor;

/**
 * General application beans that don't belong to a more specific config class.
 *
 * - RestTemplate: HTTP client for external API calls (OTP SMS provider, etc.)
 * - emailTaskExecutor: dedicated thread pool for async email/notification dispatch
 *   so SMTP latency never blocks a request thread.
 */
@Configuration
@EnableAsync
public class AppConfig {

    /**
     * RestTemplate for external HTTP calls.
     * Kept here — NOT in SecurityConfig where it was previously misplaced.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Thread pool dedicated to async email + notification sending.
     * Sized conservatively; tune via environment / application properties.
     *
     * Usage in services:
     *   @Async("emailTaskExecutor")
     *   public CompletableFuture<Void> sendEmailAsync(...) { ... }
     */
    @Bean(name = "emailTaskExecutor")
    public Executor emailTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(8);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("email-async-");
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }
}
