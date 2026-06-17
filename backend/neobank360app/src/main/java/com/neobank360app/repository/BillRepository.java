package com.neobank360app.repository;

import com.neobank360app.entity.Bill;
import com.neobank360app.entity.BillStatus;
import com.neobank360app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BillRepository
        extends JpaRepository<Bill, Long> {

    List<Bill> findByUser(
            User user
    );

    List<Bill> findByUserAndStatus(
            User user,
            BillStatus status
    );

    List<Bill> findByStatusAndDueDateBefore(
            BillStatus status,
            LocalDate date
    );
}