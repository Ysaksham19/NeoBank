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
import java.util.*;

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
    public BudgetResponseDTO createBudget(BudgetRequestDTO request) {

        User user = getAuthenticatedUser();

        if (request.getLimitAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Budget limit must be greater than zero.");
        }

        LocalDate normalizedMonth = request.getBudgetMonth().withDayOfMonth(1);

        boolean exists = budgetRepository
                .findByUserAndCategoryAndBudgetMonth(user, request.getCategory(), normalizedMonth)
                .isPresent();

        if (exists) {
            throw new DuplicateResourceException(
                    "Budget already exists for this category and month.");
        }

        Budget budget = new Budget();
        budget.setUser(user);
        budget.setCategory(request.getCategory());
        budget.setBudgetMonth(normalizedMonth);
        budget.setLimitAmount(request.getLimitAmount());

        Budget savedBudget = budgetRepository.save(budget);

        // Calculate spentAmount for the response
        LocalDate start = normalizedMonth;
        LocalDate end   = normalizedMonth.withDayOfMonth(normalizedMonth.lengthOfMonth());
        BigDecimal spent     = calculateSpentAmount(user, savedBudget.getCategory(), start, end);
        BigDecimal remaining = savedBudget.getLimitAmount().subtract(spent);

        return new BudgetResponseDTO(
                savedBudget.getId(),
                savedBudget.getCategory(),
                savedBudget.getBudgetMonth(),
                savedBudget.getLimitAmount(),
                spent,
                remaining
        );
    }

    // =========================================================
    // GET ALL BUDGETS  (now includes spentAmount + remainingAmount)
    // =========================================================

    @Transactional(readOnly = true)
    public List<BudgetResponseDTO> getMyBudgets() {

        User user = getAuthenticatedUser();
        List<Budget> budgets = budgetRepository.findByUser(user);
        List<BudgetResponseDTO> response = new ArrayList<>();

        for (Budget budget : budgets) {
            LocalDate start = budget.getBudgetMonth().withDayOfMonth(1);
            LocalDate end   = budget.getBudgetMonth()
                    .withDayOfMonth(budget.getBudgetMonth().lengthOfMonth());

            BigDecimal spent     = calculateSpentAmount(user, budget.getCategory(), start, end);
            BigDecimal remaining = budget.getLimitAmount().subtract(spent);

            response.add(new BudgetResponseDTO(
                    budget.getId(),
                    budget.getCategory(),
                    budget.getBudgetMonth(),
                    budget.getLimitAmount(),
                    spent,
                    remaining
            ));
        }

        return response;
    }

    // =========================================================
    // UPDATE BUDGET LIMIT
    // =========================================================

    @Transactional
    public BudgetResponseDTO updateBudget(Long budgetId, BudgetRequestDTO request) {

        User user = getAuthenticatedUser();

        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found."));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to update this budget.");
        }

        if (request.getLimitAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Limit amount must be greater than zero.");
        }

        budget.setLimitAmount(request.getLimitAmount());
        Budget saved = budgetRepository.save(budget);

        LocalDate start = saved.getBudgetMonth().withDayOfMonth(1);
        LocalDate end   = saved.getBudgetMonth()
                .withDayOfMonth(saved.getBudgetMonth().lengthOfMonth());
        BigDecimal spent     = calculateSpentAmount(user, saved.getCategory(), start, end);
        BigDecimal remaining = saved.getLimitAmount().subtract(spent);

        return new BudgetResponseDTO(
                saved.getId(),
                saved.getCategory(),
                saved.getBudgetMonth(),
                saved.getLimitAmount(),
                spent,
                remaining
        );
    }

    // =========================================================
    // DELETE BUDGET
    // =========================================================

    @Transactional
    public void deleteBudget(Long budgetId) {

        User user = getAuthenticatedUser();

        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found."));

        if (!budget.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to delete this budget.");
        }

        budgetRepository.delete(budget);
    }

    // =========================================================
    // GET BUDGET SUMMARY  (unchanged logic)
    // =========================================================

    @Transactional(readOnly = true)
    public List<BudgetSummaryDTO> getBudgetSummary(Long userId, String month) {

        User authenticatedUser = getAuthenticatedUser();

        if (!authenticatedUser.getId().equals(userId)) {
            throw new UnauthorizedAccountAccessException(
                    "You are not authorized to access this budget.");
        }

        YearMonth yearMonth;
        try {
            yearMonth = YearMonth.parse(month);
        } catch (Exception e) {
            throw new IllegalArgumentException("Month must be in YYYY-MM format.");
        }

        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate   = yearMonth.atEndOfMonth();

        List<Budget> budgets = budgetRepository
                .findByUserAndBudgetMonthBetween(authenticatedUser, startDate, endDate);

        List<BudgetSummaryDTO> summaries = new ArrayList<>();

        for (Budget budget : budgets) {
            BigDecimal spent     = calculateSpentAmount(
                    authenticatedUser, budget.getCategory(), startDate, endDate);
            BigDecimal remaining = budget.getLimitAmount().subtract(spent);
            double utilization   = spent
                    .divide(budget.getLimitAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();

            summaries.add(new BudgetSummaryDTO(
                    budget.getCategory(),
                    budget.getLimitAmount(),
                    spent,
                    remaining,
                    utilization
            ));
        }

        return summaries;
    }

    // =========================================================
    // GET BUDGET ALERTS  (budgets >= 80% utilized this month)
    // =========================================================

    @Transactional(readOnly = true)
    public List<BudgetSummaryDTO> getBudgetAlerts() {

        User user = getAuthenticatedUser();
        LocalDate start = YearMonth.now().atDay(1);
        LocalDate end   = YearMonth.now().atEndOfMonth();

        List<Budget> budgets = budgetRepository
                .findByUserAndBudgetMonthBetween(user, start, end);

        List<BudgetSummaryDTO> alerts = new ArrayList<>();

        for (Budget budget : budgets) {
            BigDecimal spent = calculateSpentAmount(
                    user, budget.getCategory(), start, end);

            double utilization = spent
                    .divide(budget.getLimitAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();

            if (utilization >= 80.0) {
                alerts.add(new BudgetSummaryDTO(
                        budget.getCategory(),
                        budget.getLimitAmount(),
                        spent,
                        budget.getLimitAmount().subtract(spent),
                        utilization
                ));
            }
        }

        return alerts;
    }

    // =========================================================
    // COPY LAST MONTH'S BUDGETS INTO CURRENT MONTH
    // =========================================================

    @Transactional
    public List<BudgetResponseDTO> copyLastMonthBudgets() {

        User user = getAuthenticatedUser();
        YearMonth lastMonth = YearMonth.now().minusMonths(1);
        LocalDate lastStart = lastMonth.atDay(1);
        LocalDate lastEnd   = lastMonth.atEndOfMonth();

        List<Budget> lastMonthBudgets = budgetRepository
                .findByUserAndBudgetMonthBetween(user, lastStart, lastEnd);

        if (lastMonthBudgets.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No budgets found for last month to copy.");
        }

        LocalDate thisMonthStart = YearMonth.now().atDay(1);
        LocalDate thisMonthEnd   = YearMonth.now().atEndOfMonth();
        List<BudgetResponseDTO> created = new ArrayList<>();

        for (Budget old : lastMonthBudgets) {
            boolean alreadyExists = budgetRepository
                    .findByUserAndCategoryAndBudgetMonth(
                            user, old.getCategory(), thisMonthStart)
                    .isPresent();

            if (!alreadyExists) {
                Budget newBudget = new Budget();
                newBudget.setUser(user);
                newBudget.setCategory(old.getCategory());
                newBudget.setBudgetMonth(thisMonthStart);
                newBudget.setLimitAmount(old.getLimitAmount());

                Budget saved = budgetRepository.save(newBudget);

                BigDecimal spent     = calculateSpentAmount(
                        user, saved.getCategory(), thisMonthStart, thisMonthEnd);
                BigDecimal remaining = saved.getLimitAmount().subtract(spent);

                created.add(new BudgetResponseDTO(
                        saved.getId(),
                        saved.getCategory(),
                        saved.getBudgetMonth(),
                        saved.getLimitAmount(),
                        spent,
                        remaining
                ));
            }
        }

        return created;
    }

    // =========================================================
    // BUDGET HISTORY (past N months)
    // =========================================================

    @Transactional(readOnly = true)
    public Map<String, List<BudgetSummaryDTO>> getBudgetHistory(int months) {

        User user = getAuthenticatedUser();
        Map<String, List<BudgetSummaryDTO>> history = new LinkedHashMap<>();

        for (int i = 0; i < months; i++) {
            YearMonth ym    = YearMonth.now().minusMonths(i);
            String label    = ym.toString();  // "2025-06"
            LocalDate start = ym.atDay(1);
            LocalDate end   = ym.atEndOfMonth();

            List<Budget> budgets = budgetRepository
                    .findByUserAndBudgetMonthBetween(user, start, end);

            List<BudgetSummaryDTO> summaries = new ArrayList<>();

            for (Budget budget : budgets) {
                BigDecimal spent     = calculateSpentAmount(
                        user, budget.getCategory(), start, end);
                BigDecimal remaining = budget.getLimitAmount().subtract(spent);
                double utilization   = spent
                        .divide(budget.getLimitAmount(), 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100))
                        .doubleValue();

                summaries.add(new BudgetSummaryDTO(
                        budget.getCategory(),
                        budget.getLimitAmount(),
                        spent,
                        remaining,
                        utilization
                ));
            }

            history.put(label, summaries);
        }

        return history;
    }

    // =========================================================
    // CALCULATE SPENT  (private — unchanged logic)
    // =========================================================

    private BigDecimal calculateSpentAmount(
            User user,
            BudgetCategory category,
            LocalDate startDate,
            LocalDate endDate
    ) {
        List<Transaction> transactions =
                transactionRepository.findByAccountUserId(user.getId());

        BigDecimal total = BigDecimal.ZERO;

        for (Transaction transaction : transactions) {

            if (transaction.getCreatedAt() == null) continue;

            LocalDate transactionDate = transaction.getCreatedAt().toLocalDate();

            boolean withinRange =
                    !transactionDate.isBefore(startDate) &&
                    !transactionDate.isAfter(endDate);

            if (!withinRange) continue;

            BudgetCategory mappedCategory = mapCategory(transaction.getRemarks());

            if (mappedCategory == category) {
                total = total.add(transaction.getAmount());
            }
        }

        return total;
    }

    // =========================================================
    // CATEGORY MAPPING  (private — unchanged logic)
    // =========================================================

    private BudgetCategory mapCategory(String remarks) {

        if (remarks == null) return BudgetCategory.OTHER;

        String text = remarks.toLowerCase();

        if (text.contains("grocery") || text.contains("mart") || text.contains("food"))
            return BudgetCategory.GROCERIES;

        if (text.contains("electricity") || text.contains("water")
                || text.contains("gas") || text.contains("utility"))
            return BudgetCategory.UTILITIES;

        if (text.contains("rent"))
            return BudgetCategory.RENT;

        if (text.contains("movie") || text.contains("entertainment") || text.contains("netflix"))
            return BudgetCategory.ENTERTAINMENT;

        if (text.contains("transfer") || text.contains("upi"))
            return BudgetCategory.TRANSFER;

        return BudgetCategory.OTHER;
    }

    // =========================================================
    // AUTH USER  (private — unchanged)
    // =========================================================

    private User getAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}