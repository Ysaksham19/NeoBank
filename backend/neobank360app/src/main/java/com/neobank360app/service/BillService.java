package com.neobank360app.service;

import com.neobank360app.dto.BillRequestDTO;
import com.neobank360app.dto.BillResponseDTO;
import com.neobank360app.entity.*;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.exception.UnauthorizedAccountAccessException;
import com.neobank360app.repository.BillRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final UserRepository userRepository;
    private final RewardService rewardService;
    private final NotificationService notificationService;

    public BillService(
            BillRepository billRepository,
            UserRepository userRepository,
            RewardService rewardService,
            NotificationService notificationService
    ) {
        this.billRepository = billRepository;
        this.userRepository = userRepository;
        this.rewardService = rewardService;
        this.notificationService = notificationService;
    }

    // =========================================================
    // CASHBACK TIER ENGINE
    //  ₹1     – ₹499    → 1.0%
    //  ₹500   – ₹1,999  → 2.0%
    //  ₹2,000 – ₹4,999  → 2.5%
    //  ₹5,000+           → 3.0%
    // =========================================================

    private BigDecimal getCashbackRate(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.valueOf(500)) < 0) {
            return BigDecimal.valueOf(0.01);
        } else if (amount.compareTo(BigDecimal.valueOf(2000)) < 0) {
            return BigDecimal.valueOf(0.02);
        } else if (amount.compareTo(BigDecimal.valueOf(5000)) < 0) {
            return BigDecimal.valueOf(0.025);
        } else {
            return BigDecimal.valueOf(0.03);
        }
    }

    private String getCashbackDescription(BigDecimal amount, BigDecimal rate) {
        String pct = rate.multiply(BigDecimal.valueOf(100))
                .stripTrailingZeros().toPlainString();
        return pct + "% cashback on bill payment of ₹" +
                amount.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    // =========================================================
    // CREATE BILL
    // =========================================================

    @Transactional
    public BillResponseDTO createBill(BillRequestDTO request) {

        User user = getAuthenticatedUser();

        Bill bill = new Bill();
        bill.setUser(user);
        bill.setCategory(request.getCategory());
        bill.setBillerName(request.getBillerName());
        bill.setAmount(request.getAmount());
        bill.setDueDate(request.getDueDate());
        bill.setStatus(BillStatus.PENDING);

        Bill savedBill = billRepository.save(bill);

        // ── Notification ──                    FIXED: title added
        try {
            notificationService.createNotification(
                    user,
                    NotificationType.BILL_REMINDER,
                    "Bill Added",
                    "New bill added for " + bill.getBillerName() +
                            " of ₹" + bill.getAmount()
            );
        } catch (Exception e) {
            System.err.println("Notification failed on createBill: " + e.getMessage());
        }

        return mapToResponse(savedBill);
    }

    // =========================================================
    // GET MY BILLS
    // =========================================================

    @Transactional(readOnly = true)
    public List<BillResponseDTO> getMyBills() {
        User user = getAuthenticatedUser();
        List<Bill> bills = billRepository.findByUser(user);
        List<BillResponseDTO> response = new ArrayList<>();
        for (Bill bill : bills) {
            response.add(mapToResponse(bill));
        }
        return response;
    }

    // =========================================================
    // GET PENDING BILLS
    // =========================================================

    @Transactional(readOnly = true)
    public List<BillResponseDTO> getPendingBills() {
        User user = getAuthenticatedUser();
        List<Bill> bills = billRepository.findByUserAndStatus(user, BillStatus.PENDING);
        List<BillResponseDTO> response = new ArrayList<>();
        for (Bill bill : bills) {
            response.add(mapToResponse(bill));
        }
        return response;
    }

    // =========================================================
    // GET OVERDUE BILLS
    // =========================================================

    @Transactional(readOnly = true)
    public List<BillResponseDTO> getOverdueBills() {
        User user = getAuthenticatedUser();
        List<Bill> bills = billRepository.findByUserAndStatus(user, BillStatus.OVERDUE);
        List<BillResponseDTO> response = new ArrayList<>();
        for (Bill bill : bills) {
            response.add(mapToResponse(bill));
        }
        return response;
    }

    // =========================================================
    // PAY BILL
    // =========================================================

    @Transactional
    public BillResponseDTO payBill(Long billId) {

        User user = getAuthenticatedUser();

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found."));

        if (!bill.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to pay this bill.");
        }

        if (bill.getStatus() == BillStatus.PAID) {
            throw new IllegalArgumentException("This bill has already been paid.");
        }

        bill.setStatus(BillStatus.PAID);
        Bill savedBill = billRepository.save(bill);

        // ── Tiered Cashback ──
        try {
            BigDecimal amount   = bill.getAmount();
            BigDecimal rate     = getCashbackRate(amount);
            BigDecimal cashback = amount.multiply(rate).setScale(2, RoundingMode.HALF_UP);
            rewardService.createReward(
                    user,
                    RewardType.CASHBACK,
                    cashback,
                    getCashbackDescription(amount, rate)
            );
        } catch (Exception e) {
            System.err.println("Reward creation failed for bill " + billId + ": " + e.getMessage());
        }

        // ── Notification ──                    FIXED: title added
        try {
            BigDecimal rate = getCashbackRate(bill.getAmount());
            String pct = rate.multiply(BigDecimal.valueOf(100))
                    .stripTrailingZeros().toPlainString();
            notificationService.createNotification(
                    user,
                    NotificationType.BILL_REMINDER,
                    "Bill Payment Successful",
                    "Bill paid for " + bill.getBillerName() +
                            " — " + pct + "% cashback credited!"
            );
        } catch (Exception e) {
            System.err.println("Notification failed for bill " + billId + ": " + e.getMessage());
        }

        return mapToResponse(savedBill);
    }

    // =========================================================
    // DELETE BILL
    // =========================================================

    @Transactional
    public void deleteBill(Long billId) {

        User user = getAuthenticatedUser();

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found."));

        if (!bill.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to delete this bill.");
        }

        if (bill.getStatus() == BillStatus.PAID) {
            throw new IllegalArgumentException(
                    "Paid bills cannot be deleted. They are kept for your records.");
        }

        billRepository.delete(bill);
    }

    // =========================================================
    // SCHEDULED: OVERDUE BILL CHECKER — runs every midnight
    // =========================================================

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void updateOverdueBills() {
        List<Bill> overdueBills = billRepository
                .findByStatusAndDueDateBefore(BillStatus.PENDING, LocalDate.now());

        for (Bill bill : overdueBills) {
            bill.setStatus(BillStatus.OVERDUE);
            billRepository.save(bill);

            // ── Notification ──                FIXED: title added
            try {
                notificationService.createNotification(
                        bill.getUser(),
                        NotificationType.BILL_REMINDER,
                        "Bill Overdue",
                        "Bill overdue for " + bill.getBillerName()
                );
            } catch (Exception e) {
                System.err.println("Overdue notification failed: " + e.getMessage());
            }
        }
    }

    // =========================================================
    // RESPONSE MAPPER
    // =========================================================

    private BillResponseDTO mapToResponse(Bill bill) {
        return new BillResponseDTO(
                bill.getId(),
                bill.getCategory(),
                bill.getBillerName(),
                bill.getAmount(),
                bill.getDueDate(),
                bill.getStatus()
        );
    }

    // =========================================================
    // AUTH USER
    // =========================================================

    private User getAuthenticatedUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}