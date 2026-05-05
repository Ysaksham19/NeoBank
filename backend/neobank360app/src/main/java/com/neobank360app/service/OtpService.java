package com.neobank360app.service;

import com.neobank360app.dto.SendOtpRequest;
import com.neobank360app.dto.VerifyOtpRequest;
import com.neobank360app.entity.OtpVerification;
import com.neobank360app.exception.TooManyRequestsException;
import com.neobank360app.repository.OtpVerificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class OtpService {

    private static final Logger log = LoggerFactory.getLogger(OtpService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int OTP_COOLDOWN_SECONDS = 60;

    private final OtpVerificationRepository otpRepository;
    private final JavaMailSender mailSender;
    private final RestTemplate restTemplate;

    @Value("${app.fast2sms.api-key:NOTSET}")
    private String fast2smsApiKey;

    @Value("${app.fast2sms.url}")
    private String fast2smsUrl;

    @Value("${app.otp.dev-mode:false}")
    private boolean devMode;

    public OtpService(OtpVerificationRepository otpRepository,
                      JavaMailSender mailSender,
                      RestTemplate restTemplate) {
        this.otpRepository = otpRepository;
        this.mailSender = mailSender;
        this.restTemplate = restTemplate;
    }

    // ── SEND OTP ──────────────────────────────────────────────────────────────
    public Map<String, String> sendOtp(SendOtpRequest request) {

        // Rate limit check
        Optional<OtpVerification> recent = otpRepository
                .findTopByReferenceAndOtpTypeAndIsVerifiedFalseOrderByCreatedAtDesc(
                        request.getReference(), request.getOtpType());

        if (recent.isPresent()) {
            LocalDateTime cooldownUntil = recent.get().getCreatedAt()
                                                .plusSeconds(OTP_COOLDOWN_SECONDS);
            if (LocalDateTime.now().isBefore(cooldownUntil))
                throw new TooManyRequestsException(
                    "Please wait " + OTP_COOLDOWN_SECONDS + " seconds before requesting another OTP.");
        }

        // Generate and persist OTP record
        String otp = generateOtp();
        OtpVerification record = new OtpVerification();
        record.setReference(request.getReference());
        record.setOtpType(request.getOtpType());
        record.setOtpCode(otp);
        record.setVerified(false);
        record.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpRepository.save(record);

        // Build response map
        Map<String, String> result = new HashMap<>();
        result.put("message", "OTP sent successfully");
        result.put("otpType", request.getOtpType());
        result.put("reference", request.getReference());

        // ✅ switch block — properly closed with braces
        switch (request.getOtpType()) {
            case "EMAIL_OTP" -> {
                sendEmailOtp(request.getReference(), otp);
                if (devMode) {
                    log.info("📧 [DEV] EMAIL_OTP for {} → {}", request.getReference(), otp);
                    result.put("devOtp", otp);
                }
            }
            case "MOBILE_OTP" -> {
                sendSmsOtp(request.getReference(), otp);
                if (devMode) {
                    log.info("📱 [DEV] MOBILE_OTP for {} → {}", request.getReference(), otp);
                    result.put("devOtp", otp);
                }
            }
            case "AADHAAR_OTP" -> {
                if (devMode) {
                    log.info("🆔 [DEV] AADHAAR_OTP for {} → {}", request.getReference(), otp);
                    result.put("devOtp", otp);
                }
            }
            default -> throw new IllegalArgumentException(
                    "Invalid OTP type: " + request.getOtpType());
        } // ✅ switch closing brace

        return result; // ✅ FIXED — was missing, caused compile error
    } // ✅ sendOtp() closing brace

    // ── VERIFY OTP ────────────────────────────────────────────────────────────
    public boolean verifyOtp(VerifyOtpRequest request) {
        OtpVerification otp = otpRepository
                .findTopByReferenceAndOtpTypeAndIsVerifiedFalseOrderByCreatedAtDesc(
                        request.getReference(), request.getOtpType())
                .orElseThrow(() -> new IllegalArgumentException(
                        "OTP not found or already used."));

        if (LocalDateTime.now().isAfter(otp.getExpiresAt()))
            throw new IllegalArgumentException("OTP has expired. Please request a new one.");

        if (!otp.getOtpCode().equals(request.getOtpCode()))
            throw new IllegalArgumentException("Invalid OTP. Please try again.");

        otp.setVerified(true);
        otpRepository.save(otp);
        return true;
    }

    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────

    private void sendEmailOtp(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("NEO BANK — Email Verification OTP");
            message.setText(
                "Dear Customer,\n\n" +
                "Your NEO BANK OTP is: " + otp + "\n\n" +
                "Valid for 10 minutes. Do NOT share this OTP with anyone.\n\n" +
                "Regards,\nNEO BANK Security Team"
            );
            mailSender.send(message);
            log.info("Email OTP sent to {}", toEmail);
        } catch (Exception e) {
            log.error("Email OTP send failed for {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send email OTP. Please try again.");
        }
    }

    private void sendSmsOtp(String phone, String otp) {
        if (!"NOTSET".equals(fast2smsApiKey)) {
            sendViaFast2Sms(phone, otp);
        } else {
            log.warn("Fast2SMS API key not configured. SMS delivery skipped for: {}", phone);
        }
    }

    private void sendViaFast2Sms(String phone, String otp) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("authorization", fast2smsApiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();
            body.put("route", "otp");
            body.put("variables_values", otp);
            body.put("numbers", phone);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    fast2smsUrl, new HttpEntity<>(body, headers), String.class);
            log.info("Fast2SMS response for {}: {}", phone, response.getBody());
        } catch (Exception e) {
            log.error("Fast2SMS failed for {}: {}", phone, e.getMessage());
            throw new RuntimeException("Failed to send SMS OTP. Please try again.");
        }
    }

    private String generateOtp() {
        return String.valueOf(SECURE_RANDOM.nextInt(900000) + 100000);
    }
}