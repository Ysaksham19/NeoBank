package com.neobank360app.service;

import com.neobank360app.dto.BudgetRequestDTO;
import com.neobank360app.dto.BudgetResponseDTO;
import com.neobank360app.dto.BudgetSummaryDTO;
import com.neobank360app.entity.*;
import com.neobank360app.exception.DuplicateResourceException;
import com.neobank360app.exception.ResourceNotFoundException;
import com.neobank360app.exception.UnauthorizedAccountAccessException;
import com.neobank360app.repository.BudgetRepository;
import com.neobank360app.repository.TransactionRepository;
import com.neobank360app.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    private final UserRepository userRepository;

    private final TransactionRepository transactionRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository
    ) {

        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    // =========================================================
    // CREATE BUDGET
    // =========================================================

    @Transactional
    public BudgetResponseDTO createBudget(
            BudgetRequestDTO request
    ) {

        User user = getAuthenticatedUser();

        if (request.getLimitAmount()
                .compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Budget limit must be greater than zero."
            );
        }

        LocalDate normalizedMonth =
                request.getBudgetMonth()
                        .withDayOfMonth(1);

        boolean exists =
                budgetRepository
                        .findByUserAndCategoryAndBudgetMonth(
                                user,
                                request.getCategory(),
                                normalizedMonth
                        )
                        .isPresent();

        if (exists) {

            throw new DuplicateResourceException(
                    "Budget already exists for this category and month."
            );
        }

        Budget budget = new Budget();

        budget.setUser(user);

        budget.setCategory(
                request.getCategory()
        );

        budget.setBudgetMonth(
                normalizedMonth
        );

        budget.setLimitAmount(
                request.getLimitAmount()
        );

        Budget savedBudget =
                budgetRepository.save(budget);

        return new BudgetResponseDTO(

                savedBudget.getId(),

                savedBudget.getCategory(),

                savedBudget.getBudgetMonth(),

                savedBudget.getLimitAmount()
        );
    }

    // =========================================================
    // GET ALL BUDGETS
    // =========================================================

    @Transactional(readOnly = true)
    public List<BudgetResponseDTO> getMyBudgets() {

        User user = getAuthenticatedUser();

        List<Budget> budgets =
                budgetRepository.findByUser(user);

        List<BudgetResponseDTO> response =
                new ArrayList<>();

        for (Budget budget : budgets) {

            response.add(

                    new BudgetResponseDTO(

                            budget.getId(),

                            budget.getCategory(),

                            budget.getBudgetMonth(),

                            budget.getLimitAmount()
                    )
            );
        }

        return response;
    }

    // =========================================================
    // DELETE BUDGET
    // =========================================================

    @Transactional
    public void deleteBudget(
            Long budgetId
    ) {

        User user = getAuthenticatedUser();

        Budget budget =
                budgetRepository.findById(budgetId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Budget not found."
                                ));

        if (!budget.getUser()
                .getId()
                .equals(user.getId())) {

            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to delete this budget."
            );
        }

        budgetRepository.delete(budget);
    }

    // =========================================================
    // GET BUDGET SUMMARY
    // =========================================================

    @Transactional(readOnly = true)
    public List<BudgetSummaryDTO> getBudgetSummary(
            Long userId,
            String month
    ) {

        User authenticatedUser =
                getAuthenticatedUser();

        if (!authenticatedUser.getId()
                .equals(userId)) {

            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to access this budget."
            );
        }

        YearMonth yearMonth;

        try {

            yearMonth = YearMonth.parse(month);

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Month must be in YYYY-MM format."
            );
        }

        LocalDate startDate =
                yearMonth.atDay(1);

        LocalDate endDate =
                yearMonth.atEndOfMonth();

        List<Budget> budgets =
                budgetRepository
                        .findByUserAndBudgetMonthBetween(
                                authenticatedUser,
                                startDate,
                                endDate
                        );

        List<BudgetSummaryDTO> summaries =
                new ArrayList<>();

        for (Budget budget : budgets) {

            BigDecimal spent =
                    calculateSpentAmount(
                            authenticatedUser,
                            budget.getCategory(),
                            startDate,
                            endDate
                    );

            BigDecimal remaining =
                    budget.getLimitAmount()
                            .subtract(spent);

            double utilization =
                    spent.divide(
                                    budget.getLimitAmount(),
                                    4,
                                    RoundingMode.HALF_UP
                            )
                            .multiply(BigDecimal.valueOf(100))
                            .doubleValue();

            summaries.add(

                    new BudgetSummaryDTO(

                            budget.getCategory(),

                            budget.getLimitAmount(),

                            spent,

                            remaining,

                            utilization
                    )
            );
        }

        return summaries;
    }

    // =========================================================
    // CALCULATE SPENT
    // =========================================================

    private BigDecimal calculateSpentAmount(

            User user,

            BudgetCategory category,

            LocalDate startDate,

            LocalDate endDate
    ) {

        List<Transaction> transactions =
                transactionRepository
                        .findByAccountUserId(
                                user.getId()
                        );

        BigDecimal total =
                BigDecimal.ZERO;

        for (Transaction transaction : transactions) {

            if (transaction.getCreatedAt() == null) {
                continue;
            }

            LocalDate transactionDate =
                    transaction.getCreatedAt()
                            .toLocalDate();

            boolean withinRange =
                    !transactionDate.isBefore(startDate)
                            &&
                    !transactionDate.isAfter(endDate);

            if (!withinRange) {
                continue;
            }

            String remarks =
                    transaction.getRemarks();

            BudgetCategory mappedCategory =
                    mapCategory(remarks);

            if (mappedCategory == category) {

                total = total.add(
                        transaction.getAmount()
                );
            }
        }

        return total;
    }

    // =========================================================
    // CATEGORY MAPPING
    // =========================================================

    private BudgetCategory mapCategory(
            String remarks
    ) {

        if (remarks == null) {
            return BudgetCategory.OTHER;
        }

        String text =
                remarks.toLowerCase();

        if (text.contains("grocery")
                || text.contains("mart")
                || text.contains("food")) {

            return BudgetCategory.GROCERIES;
        }

        if (text.contains("electricity")
                || text.contains("water")
                || text.contains("gas")
                || text.contains("utility")) {

            return BudgetCategory.UTILITIES;
        }

        if (text.contains("rent")) {

            return BudgetCategory.RENT;
        }

        if (text.contains("movie")
                || text.contains("entertainment")
                || text.contains("netflix")) {

            return BudgetCategory.ENTERTAINMENT;
        }

        if (text.contains("transfer")
                || text.contains("upi")) {

            return BudgetCategory.TRANSFER;
        }

        return BudgetCategory.OTHER;
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