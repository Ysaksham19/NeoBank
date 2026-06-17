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
    // CREATE BILL
    // =========================================================

    @Transactional
    public BillResponseDTO createBill(
            BillRequestDTO request
    ) {

        User user =
                getAuthenticatedUser();

        Bill bill =
                new Bill();

        bill.setUser(user);

        bill.setCategory(
                request.getCategory()
        );

        bill.setBillerName(
                request.getBillerName()
        );

        bill.setAmount(
                request.getAmount()
        );

        bill.setDueDate(
                request.getDueDate()
        );

        bill.setStatus(
                BillStatus.PENDING
        );

        Bill savedBill =
                billRepository.save(bill);

        // ───────────────── NOTIFICATION ─────────────────

        notificationService.createNotification(

                user,

                NotificationType.BILL_REMINDER,

                "New bill added for " +
                        bill.getBillerName() +
                        " of ₹" +
                        bill.getAmount()
        );

        return mapToResponse(savedBill);
    }

    // =========================================================
    // GET MY BILLS
    // =========================================================

    @Transactional(readOnly = true)
    public List<BillResponseDTO> getMyBills() {

        User user =
                getAuthenticatedUser();

        List<Bill> bills =
                billRepository.findByUser(user);

        List<BillResponseDTO> response =
                new ArrayList<>();

        for (Bill bill : bills) {

            response.add(
                    mapToResponse(bill)
            );
        }

        return response;
    }

    // =========================================================
    // GET PENDING BILLS
    // =========================================================

    @Transactional(readOnly = true)
    public List<BillResponseDTO> getPendingBills() {

        User user =
                getAuthenticatedUser();

        List<Bill> bills =
                billRepository.findByUserAndStatus(
                        user,
                        BillStatus.PENDING
                );

        List<BillResponseDTO> response =
                new ArrayList<>();

        for (Bill bill : bills) {

            response.add(
                    mapToResponse(bill)
            );
        }

        return response;
    }

    // =========================================================
    // PAY BILL
    // =========================================================

    @Transactional
    public BillResponseDTO payBill(
            Long billId
    ) {

        User user =
                getAuthenticatedUser();

        Bill bill =
                billRepository.findById(billId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Bill not found."
                                ));

        if (!bill.getUser()
                .getId()
                .equals(user.getId())) {

            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to pay this bill."
            );
        }

        if (bill.getStatus()
                == BillStatus.PAID) {

            throw new IllegalArgumentException(
                    "Bill already paid."
            );
        }

        bill.setStatus(
                BillStatus.PAID
        );

        Bill savedBill =
                billRepository.save(bill);

        // ───────────────── CASHBACK REWARD ─────────────────

        BigDecimal cashback =
                bill.getAmount()
                        .multiply(
                                BigDecimal.valueOf(0.02)
                        );

        rewardService.createReward(

                user,

                RewardType.CASHBACK,

                cashback,

                "2% cashback on bill payment"
        );

        // ───────────────── NOTIFICATION ─────────────────

        notificationService.createNotification(

                user,

                NotificationType.BILL_REMINDER,

                "Bill paid successfully for " +
                        bill.getBillerName()
        );

        return mapToResponse(savedBill);
    }

    // =========================================================
    // DELETE BILL
    // =========================================================

    @Transactional
    public void deleteBill(
            Long billId
    ) {

        User user =
                getAuthenticatedUser();

        Bill bill =
                billRepository.findById(billId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Bill not found."
                                ));

        if (!bill.getUser()
                .getId()
                .equals(user.getId())) {

            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to delete this bill."
            );
        }

        billRepository.delete(bill);
    }

    // =========================================================
    // OVERDUE BILL CHECKER
    // =========================================================

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void updateOverdueBills() {

        List<Bill> overdueBills =
                billRepository
                        .findByStatusAndDueDateBefore(
                                BillStatus.PENDING,
                                LocalDate.now()
                        );

        for (Bill bill : overdueBills) {

            bill.setStatus(
                    BillStatus.OVERDUE
            );

            billRepository.save(bill);

            // ───────────────── OVERDUE NOTIFICATION ─────────────────

            notificationService.createNotification(

                    bill.getUser(),

                    NotificationType.BILL_REMINDER,

                    "Bill overdue for " +
                            bill.getBillerName()
            );
        }
    }

    // =========================================================
    // RESPONSE MAPPER
    // =========================================================

    private BillResponseDTO mapToResponse(
            Bill bill
    ) {

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
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found."
                        ));
    }
}