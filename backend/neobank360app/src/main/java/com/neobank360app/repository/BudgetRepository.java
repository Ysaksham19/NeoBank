package com.neobank360app.repository;

import com.neobank360app.entity.Budget;
import com.neobank360app.entity.BudgetCategory;
import com.neobank360app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BudgetRepository
        extends JpaRepository<Budget, Long> {

    Optional<Budget> findByUserAndCategoryAndBudgetMonth(
            User user,
            BudgetCategory category,
            LocalDate budgetMonth
    );

    List<Budget> findByUser(User user);

    List<Budget> findByUserAndBudgetMonthBetween(
            User user,
            LocalDate startDate,
            LocalDate endDate
    );
}